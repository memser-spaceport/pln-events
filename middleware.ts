import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/embed")) {
    res.headers.set("x-hide-header", "true");
  }

  else{
    res.headers.set("x-hide-header", "false");
  }

  return res;
}
