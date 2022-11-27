import {createSlice, configureStore, PayloadAction, combineReducers} from '@reduxjs/toolkit'
import {botConfigSlice} from "./botConfigSlice";

export const store = configureStore({
    reducer: combineReducers({
        botConfig: botConfigSlice.reducer
    })
})