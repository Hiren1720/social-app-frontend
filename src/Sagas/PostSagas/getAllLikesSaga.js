import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* getAllLikes({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,key:'likeLoading',loading: true })
        let result = yield call(httpPost,{url:'/post/getLikes',body:payload});
        yield put({
            type: types.GET_LIKE_RESPONSE,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_LIKE_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* getAllLikesSaga() {
    yield all([takeLatest(types.GET_LIKE_STATE, getAllLikes)]);
}