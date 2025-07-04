<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvas;
  let chart;

  async function loadDataAndRenderChart() {
    const res = await fetch('/api/stats/users');
    if (!res.ok) {
      console.error('Failed to fetch data');
      return;
    }
    const data = await res.json();

    const ctx = canvas.getContext('2d');

    // ถ้ามี chart เดิม ให้ทำลายก่อน
    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
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
          }
        ]
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
  }

  onMount(loadDataAndRenderChart);
</script>

<div class="bg-white p-4 rounded shadow w-full h-[400px]">
  <canvas bind:this={canvas}></canvas>
</div>
