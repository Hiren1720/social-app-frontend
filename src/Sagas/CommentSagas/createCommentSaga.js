import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* createComment({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,key:'commentLoading',loading:true })
        let request = {url:'/comment/create',body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_COMMENT_STATE_SUCCESS,
            payload: result,
            loading:false
        });
        yield put({
            type: types.GET_POST_STATE,
            payload: true,
        });
    }
    catch (e) {
        yield put({
            type: types.SET_COMMENT_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* createCommentSaga() {
    yield all([takeLatest(types.SET_COMMENT_STATE, createComment)]);
}