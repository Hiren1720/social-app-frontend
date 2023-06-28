import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpGet} from "../../Helper/api";
export function* getMentionPosts({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading: payload ? !payload : true })
        let result = yield call(httpGet,`/post/getMentionPosts/${payload?.id}`);
        yield put({
            type: types.GET_MENTION_POST_RESPONSE,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_MENTION_POST_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* getMentionPostsSaga() {
    yield all([takeLatest(types.GET_MENTION_POST, getMentionPosts)]);
}