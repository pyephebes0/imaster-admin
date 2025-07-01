import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // แนะนำเก็บแบบ hashed (เช่น bcrypt)
  isAdmin: Boolean
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
