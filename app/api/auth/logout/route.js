export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `admin-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
    }
  });
}
