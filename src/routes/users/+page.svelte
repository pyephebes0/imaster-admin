<script>
	import { onMount } from 'svelte';
	let users = [];
	let total = 0;
	let page = 1;
	let limit = 10;
	let searchTerm = '';
	let newPassword = '';

	// Modal state
	let editingUser = null;

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
	function editUser(user) {
		editingUser = user;
		newPassword = '';
	}

	function closeModal() {
		editingUser = null;
	}

	async function saveChanges() {
		console.log('Updating password for user:', editingUser.username);
		console.log('New Password:', newPassword);

		const res = await fetch(`/api/users/${editingUser.id}/password`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				password: newPassword
			})
		});

		if (res.ok) {
			console.log('Password updated successfully');
			await loadUsers();
			closeModal();
		} else {
			console.error('Failed to update password');
		}
	}

	async function deactivateUser(user) {
		if (confirm(`Are you sure you want to deactivate ${user.username}?`)) {
			console.log('Deactivating user:', user);
			const res = await fetch(`/api/users/${user.id}/deactivate`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ active: false })
			});
			if (res.ok) {
				await loadUsers();
			} else {
				console.error('Failed to deactivate user');
			}
		}
	}

	$: filteredUsers = (users || []).filter((u) =>
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
				<th class="border-b px-4 py-2">Status</th>
				<th class="border-b px-4 py-2">Username</th>
				<th class="border-b px-4 py-2">Email</th>
				<th class="border-b px-4 py-2">Admin</th>
				<th class="border-b px-4 py-2">Created</th>
				<th class="border-b px-4 py-2">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredUsers as u}
				<tr class={u.isAdmin ? 'bg-blue-50' : ''}>
					<td class="border-b px-4 py-2">
						<span
							class={u.active
								? 'rounded bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'
								: 'rounded bg-red-200 px-2 py-1 text-xs font-semibold text-red-800'}
						>
							{u.active ? 'Active' : 'Inactive'}
						</span>
					</td>
					<td class="flex items-center gap-2 border-b px-4 py-2">
						{#if u.isAdmin}
							<span title="Admin">🛡️</span>
						{:else}
							<span title="User">👤</span>
						{/if}
						{u.username}
					</td>
					<td class="border-b px-4 py-2">{u.email}</td>
					<td class="border-b px-4 py-2">
						<span
							class={u.isAdmin
								? 'rounded bg-blue-200 px-2 py-1 text-xs font-semibold text-blue-900'
								: 'rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700'}
						>
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
					<td class="border-b px-4 py-2">
						<div class="flex gap-2">
							<button
								class="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
								on:click={() => editUser(u)}
							>
								Edit
							</button>
							<button
								class="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
								on:click={() => deactivateUser(u)}
							>
								Deactivate
							</button>
						</div>
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

{#if editingUser}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-full max-w-md rounded bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-lg font-semibold">Change Password</h2>

			<div class="mb-3">
				<label class="block text-sm font-medium">Username</label>
				<p class="rounded border bg-gray-100 px-3 py-2">{editingUser.username}</p>
			</div>

			<div class="mb-3">
				<label class="block text-sm font-medium">Email</label>
				<p class="rounded border bg-gray-100 px-3 py-2">{editingUser.email}</p>
			</div>

			<div class="mb-3">
				<label class="block text-sm font-medium" for="newPassword">New Password</label>
				<input
					id="newPassword"
					type="password"
					bind:value={newPassword}
					placeholder="Enter new password"
					class="w-full rounded border px-3 py-2"
				/>
			</div>

			<div class="mt-4 flex justify-end gap-2">
				<button on:click={closeModal} class="rounded bg-gray-300 px-4 py-2">Cancel</button>
				<button
					on:click={saveChanges}
					class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					disabled={newPassword.length < 6}
					title="Password must be at least 6 characters"
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}
