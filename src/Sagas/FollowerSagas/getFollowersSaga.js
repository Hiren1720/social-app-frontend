import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpGet} from "../../Helper/api";
export function* getFollowers({payload}) {
    try{
        yield put({ type: types.SET_FOLLOWER_LOADING,loading:true });
        let result = yield call(httpGet,`/follower/${payload?.id}/get${payload?.type}`);

        yield put({
            type: types.GET_FOLLOWERS_STATE_RESPONSE,
            payload: result?.data || null,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_FOLLOWERS_STATE_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* getFollowersSaga() {
    yield all([takeEvery(types.GET_FOLLOWERS_STATE, getFollowers)]);
}