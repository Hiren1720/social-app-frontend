import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getLikesComments({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,key:'likeLoading',loading: true });
        let url = `/post/${payload?.type}?id=${payload?.id}`
        let result = yield call(httpGet,url);
        yield put({
            type: types.GET_LIKES_COMMENTS_RESPONSE,
            state: payload?.type,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_LIKES_COMMENTS_RESPONSE,
            state: payload?.type,
            payload: null,
            loading:false
        });
    }

}
export function* getLikesCommentsSaga() {
    yield all([takeLatest(types.GET_LIKES_COMMENTS_STATE, getLikesComments)]);
}