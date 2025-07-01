import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';

export async function GET() {
  try {
    await connectDB();

    // หาวันเริ่มต้น และวันสิ้นสุดของวันนี้ (เวลา UTC หรือ local ตามที่ใช้)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);  // เวลา 00:00:00.000

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // เวลา 23:59:59.999

    // Query นับ user ที่ createdAt อยู่ในช่วงวันนี้
    const totalUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    return new Response(JSON.stringify({ totalUsersToday }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Failed to fetch total users today:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch data' }), { status: 500 });
  }
}
