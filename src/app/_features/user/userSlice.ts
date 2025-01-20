import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/_models/user";
 
type UserT=Omit<User,'_id'|"salt"|"password"|"portfolio"|"token"|"createdAt"|"updatedAt">
type UserTimestamps={
    createdAt:number;
    updatedAt:number|undefined;
}
export interface UserType extends UserT,UserTimestamps{}
const name="user";
const initialState:UserType ={
name:"",
email:"",
isVerified:false,
createdAt:new Date(Date.now()).getTime(),
username:undefined,
imageUrl:"/user.webp",
role:"user",
userType:"google",
updatedAt:undefined
}
const reducers={
/**
 *Remember to convert the dates to milisecounds
 */
updateUser:(state:UserType,action:PayloadAction<UserType>)=>{
//this below step is wrong because it neither muatates the state nor returns new state so immer has no way to know that state has been changed
// state=action.payload
return action.payload;

},
}

const extraReducers=(builder:ActionReducerMapBuilder<UserType>)=>{
//implement later
}



const userSlice=createSlice({name,initialState,reducers,extraReducers})
export const{updateUser}=userSlice.actions;
export default userSlice.reducer;