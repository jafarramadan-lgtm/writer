


 import { NextResponse, NextRequest } from "next/server";
 export async function middleware(request: NextRequest) {
   return NextResponse.next();

   
 }

// import { NextResponse, NextRequest } from "next/server";
// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   console.log(token,"jjjjjj")
//    const isProtectedRoute =
//     request.nextUrl.pathname.startsWith("/writer") ||
//     request.nextUrl.pathname.startsWith("/reader");
//   const isAuthRoute =
//     request.nextUrl.pathname.startsWith("/login") ||
//     request.nextUrl.pathname.startsWith("/register");
//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   let data: any = null;
//   if (token) {
//     try {
//       const response = await fetch("https://back-writer.onrender.com/roleCheck", {
//         method: "GET",
//         headers: {
//           authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
//       if (response.ok) {
//         data = await response.json();
//         if (isAuthRoute && data) {
//           if (data.role === "writer")
//             return NextResponse.redirect(new URL("/writer", request.url));
//           if (data.role === "reader")
//             return NextResponse.redirect(new URL("/reader", request.url));
//           return NextResponse.next();
//         }
//         if (isProtectedRoute && data) {
//           if (
//             data.role === "writer" &&
//             request.nextUrl.pathname.startsWith("/reader")
//           ) {
//             return NextResponse.redirect(new URL("/writer", request.url));
//           }
//           if (
//             data.role === "reader" &&
//             request.nextUrl.pathname.startsWith("/writer")
//           ) {
//             return NextResponse.redirect(new URL("/reader", request.url));
//           }
//           return NextResponse.next();
//         }
//       } else {
//         if (isProtectedRoute) {
//           const res = NextResponse.redirect(new URL("/login", request.url));
//           res.cookies.delete("token");
//           return res;
//         }
//       }
//     } catch (e) {
//       console.error("Error checking role:", e);
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/reader/:path*", "/writer/:path*", "/login", "/register"],
// };
