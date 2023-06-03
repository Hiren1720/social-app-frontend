import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* deletePost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading:true })
        let request = {url:`/post/deletePost/${payload?._id}`,body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_DELETE_POST_STATE_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_DELETE_POST_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* deletePostSaga() {
    yield all([takeLatest(types.SET_DELETE_POST_STATE, deletePost)]);
}
