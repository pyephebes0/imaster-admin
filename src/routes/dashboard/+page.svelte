<script>
  export let data;
  let { totalQueueJobs, totalOrdersToday, totalUsersToday, chartData } = data;

  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvas;
  let chart;

  onMount(() => {
    if (!chartData || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.date),
        datasets: [{
          label: 'Users',
          data: chartData.map(d => d.users),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  });
</script>

<div class="p-6 space-y-6">
  <h1 class="text-2xl font-bold">Dashboard Overview</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white shadow rounded p-4 text-center">
      <p class="text-gray-500">Queue Jobs</p>
      <p class="text-3xl font-bold">{totalQueueJobs}</p>
    </div>
    <div class="bg-white shadow rounded p-4 text-center">
      <p class="text-gray-500">Orders Today</p>
      <p class="text-3xl font-bold">{totalOrdersToday}</p>
    </div>
    <div class="bg-white shadow rounded p-4 text-center">
      <p class="text-gray-500">New Users Today</p>
      <p class="text-3xl font-bold">{totalUsersToday}</p>
    </div>
  </div>

  <div class="bg-white p-4 rounded shadow w-full h-[400px]">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
