import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export const botConfigSlice = createSlice({
    name: 'botConfig',
    initialState: {
        id: '',
        host: 'localhost',
        port: 4268,
        token: '',
    },
    reducers: {
        reset: state => {
            state.id = ''
            state.host = 'localhost'
            state.port = 4268
            state.token = ''
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setHost: (state, action: PayloadAction<string>) => {
            state.host = action.payload
        },
        setPort: (state, action: PayloadAction<number>) => {
            state.port = action.payload
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        }
    }
})
