import { SignJWT, jwtVerify } from 'jose';

// Ortam değişkenleri process.env içinde
const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET ortam değişkeni tanımlı değil! .env.local dosyasını kontrol edin.');
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

export async function createToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch (err) {
    return null;
  }
}

export function getTokenFromRequest(request) {
  // Önce cookie'den al
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('admin-token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }

  // Next.js Request.cookies APi'si varsa (App Router route handlers)
  if (request.cookies && typeof request.cookies.get === 'function') {
    const cookie = request.cookies.get('admin-token');
    if (cookie?.value) return cookie.value;
  }

  // Header'dan al (Authorization: Bearer <token>)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export async function isAuthenticated(request) {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  const payload = await verifyToken(token);
  return !!payload;
}
