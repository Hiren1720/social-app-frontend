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
        yield put({ type: types.SET_FOLLOWER_LOADING,loading: payload?.isLoading ? !payload?.isLoading : true });
        const {page=0,pageSize=10,type,id} = payload;
        let result = yield call(httpGet,`/follower/get?type=${type}&id=${id}&page=${page}&pageSize=${pageSize}`);

        yield put({
            type: types.GET_FOLLOWERS_STATE_RESPONSE,
            payload: result?.data || null,
            total: result?.total,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_FOLLOWERS_STATE_RESPONSE,
            payload: null,
            total: 0,
            loading:false
        });
    }

}
export function* getFollowersSaga() {
    yield all([takeEvery(types.GET_FOLLOWERS_STATE, getFollowers)]);
}
