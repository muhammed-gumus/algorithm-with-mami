import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET ortam değişkeni tanımlı değil! .env.local dosyasını kontrol edin.');
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

export async function middleware(request) {
  // Sadece /admin/login sayfasına erişime izin ver
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // /admin ve altındaki diğer rotaları koru
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch (err) {
    // Token geçersiz veya süresi dolmuşsa cookie'yi temizleyerek login'e at
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin-token');
    return response;
  }
}

export const config = {
  matcher: '/admin/:path*',
};
