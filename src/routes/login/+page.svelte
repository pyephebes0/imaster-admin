<script>
  let username = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    const res = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      // redirect ไป dashboard
      window.location.href = '/dashboard';
    } else {
      const data = await res.json();
      error = data.message || 'Login failed';
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <form on:submit|preventDefault={handleLogin} class="w-full max-w-md p-8 bg-white rounded shadow">
    <h1 class="text-3xl font-semibold mb-6 text-center">Admin Login</h1>

    <input
      type="text"
      bind:value={username}
      placeholder="Username"
      required
      class="mb-4 w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      type="password"
      bind:value={password}
      placeholder="Password"
      required
      class="mb-6 w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 rounded transition-colors duration-200"
    >
      Login
    </button>

    {#if error}
      <p class="text-red-600 mt-4 text-center">{error}</p>
    {/if}
  </form>
</div>

