import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getAllPost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading: payload.isLoading ? !payload.isLoading : true })
        let result = yield call(httpGet,payload?.postId ? `/post/${payload?.postId}/getPost`:'/post/getAllPost');
        yield put({
            type: types.GET_POST_STATE_SUCCESS,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_POST_STATE_FAILURE,
            payload: [],
            loading:false
        });
    }

}
export function* getAllPostSaga() {
    yield all([takeLatest(types.GET_POST_STATE, getAllPost)]);
}