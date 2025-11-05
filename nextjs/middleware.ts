import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/posts'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    const authRoutes = ['/login', '/register', '/'];
    const isAuthRoute = authRoutes.includes(pathname);

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/posts', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/posts/:path*', '/login', '/register', '/'],
};