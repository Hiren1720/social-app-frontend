import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* updatePost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading:true })
        let request = {url:'/post/update',body:payload,isFormData:true}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_UPDATE_POST_STATE_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_UPDATE_POST_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* updatePostSaga() {
    yield all([takeLatest(types.SET_UPDATE_POST_STATE, updatePost)]);
}
