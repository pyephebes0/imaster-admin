import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';

export async function GET() {
  await connectDB();

  // นับจำนวน User ที่สมัครในแต่ละวัน
  const data = await User.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        users: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const dailyStats = data.map(r => ({
    date: r._id,
    users: r.users
  }));

  const todayStr = new Date().toISOString().slice(0, 10);
  const totalUsersToday = dailyStats.find(d => d.date === todayStr)?.users ?? 0;

  return json({
    totalUsersToday,
    dailyStats
  });
}
