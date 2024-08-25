import {createSlice,PayloadAction} from '@reduxjs/toolkit';


const initialState:boolean=false;

export const darkSlice=createSlice({
    name:'darkModeRedux',
    initialState,
    reducers:{
        toggleDarkMode:(state,action:PayloadAction<boolean>)=>{
            return action.payload;
        }
    }
});


export const{toggleDarkMode}=darkSlice.actions;
export default darkSlice.reducer;