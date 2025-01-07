import {createSlice,PayloadAction} from '@reduxjs/toolkit';

type ToastMsg={
    msg:string;
    type?:'error'|'msg';
    expire?:boolean
}
const initialState:ToastMsg={
    msg:'',
    type:undefined,
    expire:undefined
};

export const toastMsgSlice=createSlice({
    name:'toastMsg',
    initialState,
    reducers:{
        setToastMsgRedux:(state,action:PayloadAction<ToastMsg>)=>{
           return { ...state, ...action.payload };
            
        },
        clearToastMsgRedux:()=>{
            return {msg:''}
            
        }
    }
});


export const{setToastMsgRedux,clearToastMsgRedux}=toastMsgSlice.actions;
export default toastMsgSlice.reducer;