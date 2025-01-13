import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const isRootPage = request.nextUrl.pathname === '/';
	
	if (!token && !isRootPage) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (token && isRootPage) {
		return NextResponse.redirect(new URL('/movies', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/movies/:path*',
		'/',
	],
};
