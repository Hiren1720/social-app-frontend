import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getComments({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,key:'likeLoading',loading:true })
        let request = `/comment/getById/${payload}`
        let result = yield call(httpGet,request)
        yield put({
            type: types.GET_COMMENT_STATE_SUCCESS,
            payload: result?.data,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_COMMENT_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* getCommentsSaga() {
    yield all([takeLatest(types.GET_COMMENT_STATE, getComments)]);
}