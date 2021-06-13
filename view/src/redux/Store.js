//Import Statements
import { combineReducers, createStore } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension'
import { userReducer } from "./UserReducer"

//Combine reducers and creating store
const rootReducer = combineReducers({ user: userReducer })
const store = createStore(rootReducer, composeWithDevTools())

//Exporting store
export default store