import { configureStore, combineReducers } from "@reduxjs/toolkit";

import counterReducer from "./counters/counterSlice";
import settingsReducer from "./settings/settingsSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  // user: userReducer,
  counter: counterReducer,
  settings: settingsReducer,
});

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  // {
  // counter: counterReducer,
  // settings: persistedSettingsReducer,
  // comments: commentsReducer,
  // users: usersReducer,
  // },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
