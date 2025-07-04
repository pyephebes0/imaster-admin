import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';
import { verifyToken } from '$lib/auth.js';

export async function load({ cookies }) {
  await connectDB();

  const token = cookies.get('jwt');
  if (!token) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  const userId = verifyToken(token);
  if (!userId) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  const user = await User.findById(userId);
  if (!user || !user.isAdmin) {
    return {
      status: 302,
      redirect: '/login'
    };
  }

  const totalQueueJobs = 12;  // หรือดึงจริงจาก DB
  const totalOrdersToday = 35; // หรือดึงจริงจาก DB

  // คำนวน totalUsersToday เช่นนี้
  const todayStr = new Date().toISOString().slice(0, 10);
  const chartAggregate = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        users: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
  const chartData = chartAggregate.map(r => ({
    date: r._id,
    users: r.users
  }));
  const totalUsersToday = chartData.find(d => d.date === todayStr)?.users ?? 0;

  return {
    user: {
      username: user.username,
      isAdmin: user.isAdmin
    },
    totalQueueJobs,
    totalOrdersToday,
    totalUsersToday,
    chartData
  };
}
