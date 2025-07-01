// src/routes/api/users/+server.js
import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';

export async function GET({ url }) {
  try {
    await connectDB();

    // ดึง query params
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // query ข้อมูล (ไม่ดึง password)
    const users = await User.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments();

    return new Response(
      JSON.stringify({ users, total, page, limit }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ Failed to fetch users:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch users' }),
      { status: 500 }
    );
  }
}
