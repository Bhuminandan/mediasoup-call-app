import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "../features/videoSlice"
import roomReducer from "../features/roomSlice"


export const store = configureStore({
    reducer: {
        video: videoReducer,
        room: roomReducer
    },
})

export default store