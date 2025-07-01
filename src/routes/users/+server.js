export async function load({ fetch, url }) {
  const page = url.searchParams.get('page') || '1';
  const limit = '10';

  const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
  const { users, total } = await res.json();

  return { users, total, page: parseInt(page), limit: parseInt(limit) };
}
