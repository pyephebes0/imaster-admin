<script>
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // ดู path ปัจจุบันเพื่อ active menu
  const currentPath = derived(page, $page => $page.url.pathname);

  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>

<nav class="w-64 bg-gray-800 min-h-screen text-white flex flex-col">
  <div class="p-4 text-2xl font-bold border-b border-gray-700">
    Admin Panel
  </div>
  <ul class="flex-grow">
    <li>
      <a href="/dashboard"
        class="block px-4 py-3 hover:bg-gray-700"
        class:selected={$currentPath === '/dashboard'}
        >Dashboard</a>
    </li>
    <li>
      <a href="/users"
        class="block px-4 py-3 hover:bg-gray-700"
        class:selected={$currentPath === '/users'}
        >Users</a>
    </li>
    <li>
      <a href="/settings"
        class="block px-4 py-3 hover:bg-gray-700"
        class:selected={$currentPath === '/settings'}
        >Settings</a>
    </li>
  </ul>
  <div class="p-4 border-t border-gray-700">
    <button
      on:click={logout}
      class="w-full bg-red-600 hover:bg-red-700 rounded px-4 py-2"
    >
      Logout
    </button>
  </div>
</nav>

<style>
  a.selected {
    background-color: #4b5563; /* Tailwind gray-600 */
    font-weight: bold;
  }
</style>
