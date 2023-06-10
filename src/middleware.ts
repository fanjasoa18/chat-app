import { NextRequest, NextResponse } from "next/server";

export function middleware(context: NextRequest) {
    if (context.nextUrl.pathname == '/') {
        return NextResponse.redirect(new URL('/login', context.url))
    }
    return NextResponse.next()
}
export const config = {
    matcher: '/'
}