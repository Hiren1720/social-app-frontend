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
        let result = yield call(httpGet,`/user/savedPosts`);
        console.log('result?.data',result?.data)
        yield put({
            type: types.GET_SAVED_POST_SUCCESS,
            payload: result?.data,
        });
    }
    catch (e) {
        yield put({
            type: types.GET_SAVED_POST_FAILURE,
            payload: null,
        });
    }
}
export function* getAllSavedPostsSaga() {
    yield all([takeLatest(types.GET_SAVED_POST_STATE, getAllSavedPost)]);
}
