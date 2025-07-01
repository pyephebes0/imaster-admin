import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';
import { verifyToken } from '$lib/auth.js';  // ต้องมีไฟล์นี้

export async function load({ cookies }) {
  await connectDB();

  const token = cookies.get('jwt');
  console.log('token:', token);
  if (!token) {
    console.log('No token, redirecting to login');
    return {
      status: 302,
      redirect: '/login'
    };
  }

  const userId = verifyToken(token);
  console.log('userId from token:', userId);
  if (!userId) {
    console.log('Invalid token, redirecting to login');
    return {
      status: 302,
      redirect: '/login'
    };
  }

  const user = await User.findById(userId);
  console.log('User from DB:', user);
  if (!user || !user.isAdmin) {
    console.log('User not found or not admin, redirecting to login');
    return {
      status: 302,
      redirect: '/login'
    };
  }

  return {
    user: {
      username: user.username,
      isAdmin: user.isAdmin
    }
  };
}
