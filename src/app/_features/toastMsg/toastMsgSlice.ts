import {createSlice,PayloadAction} from '@reduxjs/toolkit';

type ToastMsg={
    msg:string;
    type:'error'|'msg'
}
const initialState:ToastMsg={
    msg:'',
    type:'msg'
};

export const toastMsgSlice=createSlice({
    name:'toastMsg',
    initialState,
    reducers:{
        setToastMsgRedux:(state,action:PayloadAction<ToastMsg>)=>{
           return { ...state, ...action.payload };
            
        },
        clearToastMsgRedux:(state)=>{
            return {msg:'',type:'error'}
            
        }
    }
});


export const{setToastMsgRedux,clearToastMsgRedux}=toastMsgSlice.actions;
export default toastMsgSlice.reducer;