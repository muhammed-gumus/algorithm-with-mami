import { isAuthenticated } from '@/lib/auth';

export async function GET(request) {
  const isAuth = await isAuthenticated(request);
  
  if (isAuth) {
    return Response.json({ authenticated: true });
  }
  
  return Response.json({ authenticated: false }, { status: 401 });
}
