import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bharatvora071:Vora%402003@vorab.82mgrjm.mongodb.net/?appName=Vorab';
const DB_NAME = 'luna-beauty';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, { dbName: DB_NAME, ...opts }).then((mongoose) => {
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      throw new Error('MongoDB connection failed: ' + (error.message || error));
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

