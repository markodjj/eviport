import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/public-route(.*)"
  ]);
  
  export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) {
      // do nothing for public routes
      return;
    }
    await auth.protect(); // ensures user must be signed in
  });
  
  export const config = {
    matcher: [
      // Protect everything except static files, Next internals, etc.
      "/((?!_next|.*\\..*).*)",
      "/(api|trpc)(.*)",
    ],
  };
  