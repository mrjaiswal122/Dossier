import { createSlice,nanoid, PayloadAction } from "@reduxjs/toolkit";

type ThemeType='system'|'dark'|'light';

const initialState:ThemeType='system';
export const themeSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        setThemeRedux:(state,action: PayloadAction<ThemeType>)=>{
           return action.payload;
        },
    }

});

export const {setThemeRedux}=themeSlice.actions;
export default themeSlice.reducer;
