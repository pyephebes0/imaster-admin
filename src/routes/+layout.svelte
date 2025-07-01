<script>
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	const publicRoutes = ['/login'];

	onMount(() => {
		// client-side check
		const path = $page.url.pathname;

		// ถ้ายังไม่ login และไม่ใช่หน้า public ให้ไป login
		if (!data.user && !publicRoutes.includes(path)) {
			goto('/login');
		}

		// ถ้า login แล้วอยู่หน้า login ให้ไป dashboard
		if (data.user && path === '/login') {
			goto('/dashboard');
		}
	});
</script>

<div>
	{#if data.user}
		<div class="flex min-h-screen bg-gray-100">
			<Sidebar />
			<main class="flex-1">
				<!-- ตรงนี้ไม่ต้องซ้ำ Sidebar -->
				<slot />
			</main>
		</div>
	{:else}
		<slot />
	{/if}
</div>
