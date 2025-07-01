<script>
  import { onMount } from 'svelte';
  import OrdersChart from '$lib/components/OrdersChart.svelte';

  export let data;
  
  const { user, totalUsersToday } = data;
  let error = '';

  // สมมุติ data จาก load function
  // ในโปรดักชัน ให้ fetch จาก DB หรือ API
  const stats = {
    totalQueueJobs: 12,
    totalOrdersToday: 35,
  };

  const chartData = [
    { date: '2025-06-24', orders: 5, users: 2 },
    { date: '2025-06-25', orders: 12, users: 4 },
    { date: '2025-06-26', orders: 9, users: 3 },
    { date: '2025-06-27', orders: 15, users: 5 },
    { date: '2025-06-28', orders: 7, users: 2 },
  ];

  onMount(async () => {
    console.log("API Response: ", data);

    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      users = await res.json();
    } catch (e) {
      error = e.message;
    }
  });
</script>

<div class="p-6 space-y-6">
  <h1 class="text-2xl font-bold">Dashboard Overview</h1>

  <!-- สรุปตัวเลข -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white shadow rounded p-4">
      <p class="text-gray-500">Queue Jobs</p>
      <p class="text-3xl font-bold">{stats.totalQueueJobs}</p>
    </div>
    <div class="bg-white shadow rounded p-4">
      <p class="text-gray-500">Orders Today</p>
      <p class="text-3xl font-bold">{stats.totalOrdersToday}</p>
    </div>
    <div class="bg-white shadow rounded p-4">
      <p class="text-gray-500">New Users Today</p>
      <p class="text-3xl font-bold">{totalUsersToday ?? 0}</p>
    </div>
  </div>

  <!-- กราฟ -->
  <OrdersChart {chartData} />
</div>
