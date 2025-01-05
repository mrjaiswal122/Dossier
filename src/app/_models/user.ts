import mongoose, { Model, Schema, Types } from "mongoose";


export type User = {
  _id: Types.ObjectId;
  name: string;
  username?: string;
  email: string;
  token?:string;
  isVerified:boolean;
  userType:"google"|"mannual"
  password?: string;
  imageUrl?: string;
  salt?: string;
  role?: 'admin' | 'user';
  createdAt: Date;
  updatedAt?: Date;
  portfolio?: Types.ObjectId;  // Changed from portfolios to portfolio (singular)
};

const userSchema = new Schema({
  name: {  type: String, required: true },
  email: { type: String, required: true,unique: true,},
  token:{type :String},
  isVerified:{type: Boolean,default:false},
  userType:{type:String,enum:["google","mannual"]},
  username:{type:String, default: "" },
  password:{type:String},
  //to delete the user if not verified in 24hrs
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expireAfterSeconds: 86400, // 24 hours
      partialFilterExpression: { isVerified: false }
    }
  },
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