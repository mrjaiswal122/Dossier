import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import themeSlice from "../features/theme/themeSlice";
import darkSlice from "../features/darkMode/darkSlice";
import portfolioSlice from "../features/portfolio/portfolioSlice";
import toastMsgSlice from "../features/toastMsg/toastMsgSlice";
import userSlice from "../features/user/userSlice";

export const makeStore = () => 
  configureStore({
    reducer: {
      theme:themeSlice,
      darkModeRedux:darkSlice,
      portfolioSlice:portfolioSlice,
      toastMsgSlice:toastMsgSlice,
      userSlice,
    },
  });

export const store = makeStore(); // ✅ Store instance

export const wrapper = createWrapper(makeStore);

// ✅ Correctly infer types for RootState & AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
