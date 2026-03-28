import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!process.env.ADMIN_PASSWORD) {
      return Response.json({ success: false, error: 'Sunucu yapılandırma hatası' }, { status: 500 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
      const token = await createToken();
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `admin-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        }
      });
    }

    return Response.json({ success: false, error: 'Geçersiz şifre' }, { status: 401 });
  } catch (error) {
    return Response.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 });
  }
}
