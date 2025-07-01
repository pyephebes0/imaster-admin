import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGO_URI;

if (!MONGODB_URL) {
  throw new Error('MONGO_URI is not defined in .env');
}

let isConnected = false;

export async function connectDB() {
	if (isConnected) {
		return;
	}

	try {
		await mongoose.connect(MONGODB_URL, {
			dbName: 'xpost_app'
		});
		console.log('✅ Connected to MongoDB Atlas');
		isConnected = true;
	} catch (err) {
		console.error('❌ MongoDB connection error:', err);
	}
}
