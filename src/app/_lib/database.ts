import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;


// import mongoose from "mongoose";



// export default  async function dbConnect(){
//     try {
       
       
        
//         await mongoose.connect(`${process.env.MONGODB_URI}`);
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1);
//     }
// }
