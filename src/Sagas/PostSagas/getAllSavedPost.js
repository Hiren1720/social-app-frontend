import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpGet} from "../../Helper/api";

export function* getAllSavedPost({payload}) {
    try{
        let result = yield call(httpGet,`/post/savedPosts`);
        yield put({
            type: types.GET_SAVED_POST_RESPONSE,
            payload: result?.data || [],
        });
    }
    catch (e) {
        yield put({
            type: types.GET_SAVED_POST_RESPONSE,
            payload: [],
        });
    }
}
export function* getAllSavedPostsSaga() {
    yield all([takeLatest(types.GET_SAVED_POST_STATE, getAllSavedPost)]);
}
