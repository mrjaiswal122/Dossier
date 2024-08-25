import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    imageUrl:{type:String,required:false,default:'/user.webp'},
    salt: {type:String, required:true},
    role: {type:String, enum:['admin', 'user'], default:'user'}
},{timestamps:true});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;