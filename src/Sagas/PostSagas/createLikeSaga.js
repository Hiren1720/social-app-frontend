import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* createLike({payload}) {
    try{
        let request = {url:'/post/postLike',body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_POST_LIKE_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_POST_LIKE_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* createLikeSaga() {
    yield all([takeLatest(types.SET_POST_LIKE_STATE, createLike)]);
}
