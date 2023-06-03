// combineReducers come from redux that used for combining reducers that we just made.
import { combineReducers } from 'redux'

// Reducers
import user from './user.reducer'
import request from './request.reducer'
import post from './post.reducer'
import blockUser from "./blockUser.reducer";
export default combineReducers({
    userData:user,
    requestData:request,
    postData:post,
    blockData:blockUser
    // Here you can registering another reducers.
})
