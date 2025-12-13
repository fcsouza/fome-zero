import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

// biome-ignore lint/suspicious/useAwait: _
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // Proteger rotas de perfil
  if (pathname.startsWith('/profile') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login/doador', request.url));
  }

  // Proteger rotas de dashboard específicas
  if (pathname.startsWith('/dashboard/doador') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login/doador', request.url));
  }

  if (pathname.startsWith('/dashboard/ong') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login/ong', request.url));
  }

  // Redirecionar dashboard genérico para landing
  if (pathname === '/dashboard' && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirecionar rotas de login/signup antigas para landing
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se já tem sessão e está tentando acessar login/signup, redirecionar para dashboard apropriado
  // Nota: A validação de role será feita nas páginas dos dashboards
  if (
    (pathname.startsWith('/login') || pathname.startsWith('/signup')) &&
    sessionCookie
  ) {
    // Não redirecionar automaticamente aqui, deixar as páginas decidirem
    // baseado no role do usuário
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/login/:path*',
    '/signup/:path*',
  ],
};
