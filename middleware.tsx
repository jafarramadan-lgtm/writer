import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/writer") ||
    request.nextUrl.pathname.startsWith("/reader");

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // 1. حماية أولية: إذا المسار محمي وما في توكن، وجهه للـ login فوراً
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let data: any = null;

  if (token) {
    try {
      const response = await fetch("https://back-writer.onrender.com/roleCheck", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        data = await response.json();

        // فحص صفحات الـ Auth (لو مسجل دخول ومعه توكن صالح)
        if (isAuthRoute && data) {
          if (data.role === "writer") return NextResponse.redirect(new URL("/writer", request.url));
          if (data.role === "reader") return NextResponse.redirect(new URL("/reader", request.url));
          return NextResponse.redirect(new URL("/login", request.url));
        }

        // فحص المسارات المحمية المتبادلة
        if (isProtectedRoute && data) {
          if (data.role === "writer" && request.nextUrl.pathname.startsWith("/reader")) {
            return NextResponse.redirect(new URL("/writer", request.url));
          }
          if (data.role === "reader" && request.nextUrl.pathname.startsWith("/writer")) {
            return NextResponse.redirect(new URL("/reader", request.url));
          }
          
          // 🔥 السطر السحري الناقص: إذا الـ role متطابق مع المسار، مرره بسلام!
          return NextResponse.next();
        }

      } else {
        // إذا التوكن منتهي أو غير صالح والمسار محمي، امسح وتوجه للـ login
        if (isProtectedRoute) {
          const res = NextResponse.redirect(new URL("/login", request.url));
          res.cookies.delete("token"); // تنظيف التوكن المنتهي كرمال ما يعلق
          return res;
        }
      }
    } catch (e) {
      console.error("Error checking role:", e);
    }
  }

  // السماح لأي مسار آخر (مثل الـ الـ login لو ما في توكن أصلاً)
  return NextResponse.next();
}

export const config = {
  matcher: ["/reader/:path*", "/writer/:path*", "/login", "/register"],
};
