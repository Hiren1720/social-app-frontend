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
        yield put({ type: types.SET_LOADING,loading:true })
        let result = yield call(httpGet,payload?.state === 'followers' ? `/follower/${payload?.id}/getFollowers`:`/follower/${payload?.id}/getFollowings`);

        yield put({
            type: types.GET_FOLLOWERS_STATE_SUCCESS,
            payload: result,
            state: payload?.state,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_FOLLOWERS_STATE_FAILURE,
            payload: null,
            state: payload?.state,
            loading:false
        });
    }

}
export function* getFollowersSaga() {
    yield all([takeEvery(types.GET_FOLLOWERS_STATE, getFollowers)]);
}