import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  // 1. Protect Admin Routes
  if (path.startsWith('/admin')) {
    console.log(`[Proxy] Admin Check | User: ${session?.user?.email} | ID: ${session?.user?.id} | Path: ${path}`);
    
    if (!session) {
      console.log(`[Proxy] Redirect: No session found, moving to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error(`[Proxy] Role fetch error:`, error.message);
    }
    
    console.log(`[Proxy] Role found: ${profile?.role}`);

    if (profile?.role !== 'admin') {
      console.log(`[Proxy] Redirect: Role is ${profile?.role}, not admin. Moving to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Auth Guard
  if (session && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
