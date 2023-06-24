import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpPost} from "../../Helper/api";

export function* createSavedPost({payload}) {
    try{
        let request = {url:`/user/${payload?.id}/post`,body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_SAVED_POST_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_SAVED_POST_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* getSavedPostSaga() {
    yield all([takeEvery(types.SET_SAVED_POST_STATE, createSavedPost)]);
}
