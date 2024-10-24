import { createSlice,nanoid, PayloadAction } from "@reduxjs/toolkit";
// import { ThemeType } from "@/app/_components/navbar";
type ThemeType='system'|'dark'|'light';
const initialState='system';
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
