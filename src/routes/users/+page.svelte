<script>
	import { onMount } from 'svelte';
	let users = [];
	let total = 0;
	let page = 1;
	let limit = 10;
	let searchTerm = '';

	async function loadUsers() {
		const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
		if (res.ok) {
			const data = await res.json();
			users = data.users.sort((a, b) => {
				if (a.isAdmin === b.isAdmin) return 0;
				return a.isAdmin ? -1 : 1;
			});
			total = data.total;
			page = data.page;
			limit = data.limit;
		} else {
			console.error('Failed to load users');
		}
	}

	onMount(loadUsers);

	function nextPage() {
		if (page * limit < total) {
			page++;
			loadUsers();
		}
	}

	function prevPage() {
		if (page > 1) {
			page--;
			loadUsers();
		}
	}

	// กรอง users ตาม searchTerm
	$: filteredUsers = users.filter(u =>
		u.username.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<div class="space-y-6 p-6">
	<h1 class="mb-4 text-xl font-semibold">Users</h1>

	<div class="mb-4 flex gap-2">
		<input
			type="text"
			placeholder="ค้นหา Username..."
			bind:value={searchTerm}
			class="w-64 rounded border px-3 py-2"
		/>
	</div>

	<table class="mb-4 min-w-full rounded bg-white shadow">
		<thead>
			<tr>
				<th class="border-b px-4 py-2">Username</th>
				<th class="border-b px-4 py-2">Email</th>
				<th class="border-b px-4 py-2">Admin</th>
				<th class="border-b px-4 py-2">Created</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredUsers as u}
				<tr class={u.isAdmin ? 'bg-blue-50' : ''}>
					<td class="border-b px-4 py-2 flex items-center gap-2">
						{#if u.isAdmin}
							<span title="Admin">🛡️</span>
						{:else}
							<span title="User">👤</span>
						{/if}
						{u.username}
					</td>
					<td class="border-b px-4 py-2">{u.email}</td>
					<td class="border-b px-4 py-2">
						<span class={u.isAdmin ? 'rounded bg-blue-200 px-2 py-1 text-xs font-semibold text-blue-900' : 'rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700'}>
							{u.isAdmin ? 'Admin' : 'User'}
						</span>
					</td>
					<td class="border-b px-4 py-2">
						{new Date(u.createdAt).toLocaleDateString('en-GB', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						})}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex justify-between">
		<button on:click={prevPage} disabled={page === 1} class="rounded bg-gray-300 px-4 py-2">
			Previous
		</button>
		<button
			on:click={nextPage}
			disabled={page * limit >= total}
			class="rounded bg-gray-300 px-4 py-2"
		>
			Next
		</button>
	</div>
</div>
