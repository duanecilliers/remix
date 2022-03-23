import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  Transform
} from "jscodeshift";

import type { PackageName} from "./packagesExports";
import { packagesExports } from "./packagesExports";
import { sortBy } from "./sortBy";

export const parser = "tsx";

type Specifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
const isNamedImportsSpecifier = (
  specifier: Specifier
): specifier is ImportSpecifier => specifier.type === 'ImportSpecifier'
const isDefaultSpecifier = (
  specifier: Specifier
): specifier is ImportDefaultSpecifier => specifier.type === 'ImportDefaultSpecifier'
const isNamespaceSpecifier = (
  specifier: Specifier
): specifier is ImportNamespaceSpecifier => specifier.type === 'ImportNamespaceSpecifier'

type NamedImportIdentifier = {
  name: string
  alias: string
}

const transform: Transform = (file, api, options) => {
  // TODO: preserve comments?
  // TODO no-op for deno
  let j = api.jscodeshift
  let root = j(file.source)

  // Find all Remix imports
  let remixImports = root
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === 'remix')
  
  // no-op if there are no `remix` imports
  if (remixImports.length === 0) return null

  // TODO error on non-specifier import like `import 'remix'`
  
  // Do not handle Remix default imports
  let remixDefaultImports = remixImports
    .filter(path => path.value.specifiers?.some(isDefaultSpecifier) ?? false)
  if (remixDefaultImports.length !== 0) {
    throw Error('There should not be any default imports for Remix. Please replace the default import with named imports and try again.')
  }

  // Do not handle `remix` namespace imports
  let remixNamespaceImports = remixImports
    .filter(path => path.value.specifiers?.some(isNamespaceSpecifier) ?? false)
  if (remixNamespaceImports.length !== 0) {
    throw Error('There should not be any namespace imports for Remix. Please replace the namespace import with named imports and try again.')
  }

  // All remaining `remix` imports should be named imports
  let remixNamedImports = remixImports
    .filter(path => path.value.specifiers?.every(isNamedImportsSpecifier) ?? false)
  
  // Determine name and alias for each imported value or type
  let remixValueImports: NamedImportIdentifier[] = []
  let remixTypeImports: NamedImportIdentifier[] = [] 
  remixNamedImports.forEach(path => {
    let kind = path.value.importKind
    if (path.value.specifiers === undefined) return
    path.value.specifiers.forEach(specifier => {
      if (!isNamedImportsSpecifier(specifier)) {
        throw Error('This should never happen')
      }
      let name = specifier.imported.name
      let alias = specifier.local?.name ?? name
      if (kind === "value") {
        remixValueImports.push({ name, alias })
      }
      if (kind === "type") {
        remixTypeImports.push({ name, alias })
      }
    })
  })

  // Remember where first `remix` import is so we can write the new imports there
  let ANCHOR = j(remixImports.paths()[0])

  let writeImportDeclarations = (packageName: PackageName): void => {
    // Filter `remix` imports to those that match exports from the specified package
    let matchPackageExports = (kind: "value" | "type") => ({ name }: NamedImportIdentifier) =>
      packagesExports[packageName][kind].includes(name)
    let matchingImports = {
      value: remixValueImports.filter(matchPackageExports("value")),
      type: remixTypeImports.filter(matchPackageExports("type")),
    }

    // Convert matched imports to import declarations
    let sortByName = sortBy(({ name }: NamedImportIdentifier) => name)
    let toImportDeclaration = (imports: NamedImportIdentifier[], kind: "value" | "type"): ImportDeclaration => {
      return j.importDeclaration(
        imports
          .sort(sortByName)
          .map(({ name, alias}) => j.importSpecifier(j.identifier(name), j.identifier(alias))),
        j.literal(packageName),
        kind,
      )
    }

    // Write value import declaration
    if (matchingImports.value.length > 0) {
      ANCHOR.insertBefore(toImportDeclaration(matchingImports.value, "value"))
    }
    // Write type import declaration
    if (matchingImports.type.length > 0) {
      ANCHOR.insertBefore(toImportDeclaration(matchingImports.type, "type"))
    }
  }

  // Client framework imports
  writeImportDeclarations("@remix-run/react")

  // Server runtime imports
  let serverRuntime: PackageName = "@remix-run/node" // TODO read server runtime from options
  writeImportDeclarations(serverRuntime)

  // Adapter imports
  let serverAdapter: PackageName = "@remix-run/express" // TODO read server runtime from options
  writeImportDeclarations(serverAdapter)

  // Remove `remix` imports
  remixImports.forEach(path => j(path).remove())

  return root.toSource()
}

export default transform