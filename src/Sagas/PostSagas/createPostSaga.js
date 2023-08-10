import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* createPost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading:true })
        // let request = {url:`/post/${payload?.type}`,body:payload?.formData,isFormData:true}
        let request = {url:`/post/${payload?.type}`,body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_POST_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_POST_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* createPostSaga() {
    yield all([takeLatest(types.SET_POST_STATE, createPost)]);
}
