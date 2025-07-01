import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';
import { verifyToken } from '$lib/auth.js'; // ฟังก์ชันตรวจสอบ JWT

export async function load({ fetch, cookies }) {
  await connectDB();

  const token = cookies.get('jwt');
  if (!token) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  // ตรวจสอบ JWT และ decode payload
  const userId = verifyToken(token);
  if (!userId) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  // หา user จาก id ใน payload
  const user = await User.findById(userId);
  if (!user || !user.isAdmin) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  // ✅ ใช้ fetch จาก context
  const res = await fetch('/api/users/today');
  if (!res.ok) {
    console.error('Failed to fetch /api/users/today:', res.status);
    return {
      user: {
        username: user.username,
        isAdmin: user.isAdmin
      },
      totalUsersToday: 0 // fallback
    };
  }

  const data = await res.json();

  return {
    user: {
      username: user.username,
      isAdmin: user.isAdmin
    },
    totalUsersToday: data.totalUsersToday
  };
}
