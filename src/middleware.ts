import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,

} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) =>  {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);


    if(isApiAuthRoute) {
      return null;
    };

    if(isAuthRoute) {
      if(isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return null;
    };

    if(!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/login", nextUrl));
    }

    return null;

});

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

      '/',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }

// export const config = {
//     matcher: [
//       /*
//        * Match all request paths except for the ones starting with:
//        * - api (API routes)
//        * - _next/static (static files)
//        * - _next/image (image optimization files)
//        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//        */
//       {
//         source:
//           '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//         missing: [
//           { type: 'header', key: 'next-router-prefetch' },
//           { type: 'header', key: 'purpose', value: 'prefetch' },
//         ],
//       },
   
//       {
//         source:
//           '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//         has: [
//           { type: 'header', key: 'next-router-prefetch' },
//           { type: 'header', key: 'purpose', value: 'prefetch' },
//         ],
//       },
   
//       {
//         source:
//           '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//         has: [{ type: 'header', key: 'x-present' }],
//         missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
//       },
//     ],
//   }





// export const config = {
//     matcher: [
//       /*
//        * Match all request paths except for the ones starting with:
//        * - api (API routes)
//        * - _next/static (static files)
//        * - _next/image (image optimization files)
//        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//        */
//       '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//     ],
//   }