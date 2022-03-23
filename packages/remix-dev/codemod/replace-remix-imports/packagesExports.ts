interface Exports {
  value: string[]
  type: string[]
}

const serverRuntimeInterface: Exports = {
  value: [
    "createCookie",
    "createCookieSessionStorage",
    "createMemorySessionStorage",
    "createSessionStorage",
    "createRequestHandler",
    "createSession",
    "isCookie",
    "isSession",
    "json",
    "redirect",
  ],
  type: [
    "ActionFunction",
    "AppData",
    "AppLoadContext",
    "CreateRequestHandlerFunction",
    "Cookie",
    "CookieOptions",
    "CookieParseOptions",
    "CookieSerializeOptions",
    "CookieSignatureOptions",
    "DataFunctionArgs",
    "EntryContext",
    "ErrorBoundaryComponent",
    "HandleDataRequestFunction",
    "HandleDocumentRequestFunction",
    "HeadersFunction",
    "HtmlLinkDescriptor",
    "HtmlMetaDescriptor",
    "LinkDescriptor",
    "LinksFunction",
    "LoaderFunction",
    "MetaDescriptor",
    "MetaFunction",
    "PageLinkDescriptor",
    "RequestHandler",
    "RouteComponent",
    "RouteHandle",
    "ServerBuild",
    "ServerEntryModule",
    "Session",
    "SessionData",
    "SessionIdStorageStrategy",
    "SessionStorage",
  ],
}

export type PackageName =
  | "@remix-run/react"
  | "@remix-run/node"
  | "@remix-run/architect"
  | "@remix-run/express"
  | "@remix-run/netlify"
  | "@remix-run/vercel"
  | "@remix-run/cloudflare"
  | "@remix-run/cloudflare-pages"
  | "@remix-run/cloudflare-workers"

export const packagesExports: Record<PackageName, Exports> = {
  "@remix-run/react": {
    value: [
      "Form",
      "Link",
      "Links",
      "LiveReload",
      "Meta",
      "NavLink",
      "Outlet",
      "PrefetchPageLinks",
      "RemixBrowser",
      "RemixServer",
      "Scripts",
      "ScrollRestoration",
      "useActionData",
      "useBeforeUnload",
      "useCatch",
      "useFetcher",
      "useFetchers",
      "useFormAction",
      "useHref",
      "useLoaderData",
      "useLocation",
      "useMatches",
      "useNavigate",
      "useNavigationType",
      "useOutlet",
      "useOutletContext",
      "useParams",
      "useResolvedPath",
      "useSearchParams",
      "useSubmit",
      "useTransition",
    ],
    type: [
      "FormEncType",
      "FormMethod",
      "FormProps",
      "HtmlLinkDescriptor",
      "HtmlMetaDescriptor",
      "LinkProps",
      "NavLinkProps",
      "RemixBrowserProps",
      "RemixServerProps",
      "ShouldReloadFunction",
      "SubmitFunction",
      "SubmitOptions",
      "ThrownResponse",
    ],
  },
  "@remix-run/node": {
    value: [
      ...serverRuntimeInterface.value,
      "AbortController",
      "createFileSessionStorage",
      "fetch",
      "FormData",
      "Headers",
      "NodeOnDiskFile",
      "Request",
      "Response",
      "unstable_createFileUploadHandler",
      "unstable_createMemoryUploadHandler",
      "unstable_parseMultipartFormData",
    ],
    type: [
      ...serverRuntimeInterface.type,
      "HeadersInit",
      "RequestInfo",
      "RequestInit",
      "ResponseInit",
      "UploadHandler",
      "UploadHandlerArgs",
    ],
  },
  "@remix-run/architect": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/express": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/netlify": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/vercel": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/cloudflare": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/cloudflare-pages": {
    // TODO
    value: [],
    type: [],
  },
  "@remix-run/cloudflare-workers": {
    // TODO
    value: [],
    type: [],
  },
}