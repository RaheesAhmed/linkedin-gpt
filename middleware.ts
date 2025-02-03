import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

    const loginUrl = new URL("/sign-in", request.url)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)",
  ],
}
