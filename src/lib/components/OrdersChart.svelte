<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvas;

  // Mock Data
  const data = [
    { date: '2025-06-24', users: 12, orders: 7 },
    { date: '2025-06-25', users: 18, orders: 10 },
    { date: '2025-06-26', users: 14, orders: 5 },
    { date: '2025-06-27', users: 20, orders: 12 },
    { date: '2025-06-28', users: 25, orders: 15 },
    { date: '2025-06-29', users: 22, orders: 9 },
    { date: '2025-06-30', users: 30, orders: 20 }
  ];

  onMount(() => {
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [
          {
            label: 'Users',
            data: data.map(d => d.users),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4
          },
          {
            label: 'Orders',
            data: data.map(d => d.orders),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
</script>

<div class="bg-white p-4 rounded shadow w-full h-[400px]">
  <canvas bind:this={canvas}></canvas>
</div>
