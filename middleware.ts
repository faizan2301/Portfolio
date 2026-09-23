import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Locale routing for portfolio home only — exclude tools, games, API, and static assets
  matcher: ["/", "/(en|ar)/:path*", "/((?!api|tools|games|_next|_vercel|.*\\..*).*)"],
};
