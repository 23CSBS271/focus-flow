import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    mongoServer: null
  };
}
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    };

    // If using local MongoDB URI, start in-memory server
    if (MONGODB_URI === 'mongodb://localhost:27017/focusflow') {
      if (!cached.mongoServer) {
        cached.mongoServer = await MongoMemoryServer.create();
        const mongoUri = cached.mongoServer.getUri();
        console.log('Using in-memory MongoDB at:', mongoUri);
      }
      cached.promise = mongoose.connect(cached.mongoServer.getUri(), opts).then(mongoose => {
        return mongoose;
      });
    } else {
      // Use provided MongoDB URI (Atlas or other)
      cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
        return mongoose;
      });
    }
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
export default connectToDatabase;