import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// app/layout.tsx reads x-hide-header from the request headers, so set it on the request.
export function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set(
    "x-hide-header",
    req.nextUrl.pathname.startsWith("/embed") ? "true" : "false"
  );

  return NextResponse.next({ request: { headers } });
}
