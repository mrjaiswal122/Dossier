import mongoose from "mongoose";
export type User ={
    name: string;
    username?: string; // Optional field with a default value
    email: string;
    password?: string; // Optional field
    imageUrl?: string; // Optional field with a default value
    salt?: string; // Optional field
    role?: 'admin' | 'user'; // Enum with a default value
    createdAt?: Date; // Automatically handled by Mongoose
    updatedAt?: Date; // Automatically handled by Mongoose
  }
  

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    username:{type:String,required:false,default:""},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:false},
    imageUrl:{type:String,required:false,default:'/user.webp'},
    salt: {type:String, required:false},
    role: {type:String, enum:['admin', 'user'], default:'user'}
},{timestamps:true});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;