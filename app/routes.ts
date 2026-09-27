import { type RouteConfig, index, route } from "@react-router/dev/routes";

// English has no prefix; German and Romanian live under /de and /ro.
// The optional :lang segment is checked in routes/locale-layout.tsx.
export default [
  route("admin", "routes/admin.tsx"),
  route(":lang?", "routes/locale-layout.tsx", [
    index("routes/home.tsx"),
    route("work/:slug", "routes/case-study.tsx"),
    route("contact", "routes/contact.tsx"),
    route("contact/status", "routes/contact-status.tsx"),
    route("privacy", "routes/privacy.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
