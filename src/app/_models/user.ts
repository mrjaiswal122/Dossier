import mongoose from "mongoose";
export type User = {
  _id: mongoose.Types.ObjectId;  // Required for MongoDB documents
  name: string;
  username?: string;  // Optional field with a default value
  email: string;
  password?: string;  // Optional field
  imageUrl?: string;  // Optional field with a default value
  salt?: string;      // Optional field for password hashing
  role?: 'admin' | 'user';  // Enum with a default value
  createdAt?: Date;   // Automatically handled by Mongoose
  updatedAt?: Date;   // Automatically handled by Mongoose
  portfolios?: mongoose.Types.ObjectId;  // Portfolio references
};
  

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, default: "" },  // Default empty string if not provided
    password: { type: String },  // Password is optional, may be omitted
    imageUrl: { type: String, default: '/user.webp' },  // Default image URL
    salt: { type: String },  // Optional field used in password hashing
    role: { type: String, enum: ['admin', 'user'], default: 'user' },  // Role with default 'user'
    portfolios: { type: mongoose.Types.ObjectId, ref: 'Portfolio' },  // Portfolio references
  }, { timestamps: true });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;