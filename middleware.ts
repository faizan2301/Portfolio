import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Locale routing for portfolio home only — exclude tools, API, and static assets
  matcher: ["/", "/(en|ar)/:path*", "/((?!api|tools|_next|_vercel|.*\\..*).*)"],
};
