import mongoose, { Model, Schema, Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  name: string;
  username?: string;
  email: string;
  password?: string;
  imageUrl?: string;
  salt?: string;
  role?: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
  portfolio?: Types.ObjectId;  // Changed from portfolios to portfolio (singular)
};

const userSchema = new Schema({
  name: {  type: String, required: true },
  email: { type: String, required: true,unique: true,},
  username:{type:String, default: "" },
  password:{type:String},
  imageUrl:{type:String, default: '/user.webp' },
  salt: { type: String, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  portfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' },  // Changed from portfolios to portfolio
}, { timestamps: true });

let userModel:Model<User>;
try{
  userModel=mongoose.model<User>('User')
}catch{
     userModel=mongoose.model<User>('User',userSchema)

}
// const userModel = mongoose.models.User || mongoose.model<User>('User', userSchema);
export default userModel;