import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../_features/theme/themeSlice";
import darkSlice from "../_features/darkMode/darkSlice";
import portfolioSlice from "../_features/portfolio/portfolioSlice";
import toastMsgSlice  from "../_features/toastMsg/toastMsgSlice";
export const store=configureStore({
    reducer:{
        theme:themeSlice,
        darkModeRedux:darkSlice,
        portfolioSlice:portfolioSlice,
        toastMsgSlice:toastMsgSlice,
    }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;