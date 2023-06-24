import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpPost} from "../../Helper/api";

export function* savePost({payload}) {
    try{
        let request = {url:`/post/savePost`,body:payload}
        let result = yield call(httpPost,request);
        yield put({
            type: types.SET_SAVE_POST_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_SAVE_POST_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* savePostSaga() {
    yield all([takeEvery(types.SET_SAVE_POST_STATE, savePost)]);
}
