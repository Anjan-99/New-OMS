import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";

const secretKey = "ProfitFolio";

const persistConfig = {
  key: "ProfitFolio",
  storage,
  whitelist: ["auth"],
  blacklist: [], // The states which we don't want to persist, add them here!
  transforms: [
    encryptTransform({
      secretKey,
      onError: function (error) {
        console.error("Encryption error:", error);
      },
    }),
  ],
};

const rootReducer = combineReducers({
  auth: userSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To fix non-serializable value warning
    }),
});

const persistor = persistStore(store);

export { persistor, store };
