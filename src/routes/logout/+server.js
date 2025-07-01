// src/routes/logout/+server.js
/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
  // เคลียร์ cookie
  cookies.delete('jwt', {
    path: '/'
  });

  return new Response(null, {
    status: 302,
    headers: {
      location: '/login'
    }
  });
}


