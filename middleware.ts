import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)", // Webhook endpoint must be public
]);

export default clerkMiddleware(async (auth, request) => {
  // If accessing a private route, require authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  // Match all routes except static files and API internal routes
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
