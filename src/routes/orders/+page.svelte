<script>
	let orders = [
		{
			id: 'ORD1234',
			customerName: 'John Doe',
			amount: 1500,
			status: 'Pending', // หรือ Completed, Cancelled
			createdAt: '2025-07-04T12:00:00Z'
		},
		// ...
	];
	let page = 1;
	let limit = 10;
	let total = 100;

	function prevPage() {
		if (page > 1) page--;
	}

	function nextPage() {
		if (page * limit < total) page++;
	}

	function viewOrder(id) {
		alert(`View order ${id}`);
	}
</script>

<div class="space-y-6 p-6">
	<h1 class="mb-4 text-xl font-semibold">Orders</h1>

	<table class="mb-4 min-w-full rounded bg-white shadow">
		<thead class="bg-gray-100">
			<tr>
				<th class="border-b px-4 py-2 text-left">Order ID</th>
				<th class="border-b px-4 py-2 text-left">Customer</th>
				<th class="border-b px-4 py-2 text-left">Amount</th>
				<th class="border-b px-4 py-2 text-left">Status</th>
				<th class="border-b px-4 py-2 text-left">Created</th>
				<th class="border-b px-4 py-2 text-left">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each orders as o}
				<tr class="hover:bg-gray-50">
					<td class="border-b px-4 py-2">{o.id}</td>
					<td class="border-b px-4 py-2">{o.customerName}</td>
					<td class="border-b px-4 py-2">{o.amount} ฿</td>
					<td class="border-b px-4 py-2">
						<span
							class={
								"inline-block rounded px-2 py-1 text-xs font-medium " +
								(o.status === 'Pending'
									? 'bg-yellow-100 text-yellow-800'
									: o.status === 'Completed'
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800')
							}
						>
							{o.status}
						</span>
					</td>
					<td class="border-b px-4 py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
					<td class="border-b px-4 py-2">
						<button
							on:click={() => viewOrder(o.id)}
							class="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
						>
							View
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex justify-between">
		<button
			on:click={prevPage}
			disabled={page === 1}
			class="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
		>
			Previous
		</button>
		<button
			on:click={nextPage}
			disabled={page * limit >= total}
			class="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
		>
			Next
		</button>
	</div>
</div>
