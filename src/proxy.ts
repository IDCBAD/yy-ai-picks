import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dev/:path*",
};
