import { connectDB } from '$lib/db.js';
import { User } from '$lib/models/User.js';
import bcrypt from 'bcryptjs';
import { createToken } from '$lib/auth.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  await connectDB();

  const { username, password } = await request.json();

  const user = await User.findOne({ username });
  if (!user) {
    return json({ message: 'User not found' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return json({ message: 'Invalid password' }, { status: 401 });
  }

  if (!user.isAdmin) {
    return json({ message: 'Unauthorized' }, { status: 403 });
  }

  const token = createToken(user);
  cookies.set('jwt', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24
  });

  return json({ message: 'Login success', userId: user._id.toString() });
}
