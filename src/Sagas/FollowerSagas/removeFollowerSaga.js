import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* removeFollower({payload}) {
    try{
        yield put({ type: types.SET_BUTTON_LOADING,loading:true })
        let result = yield call(httpPost,{url:`/follower/removeFollower`,body:payload});

        yield put({
            type: types.REMOVE_FOLLOWER_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.REMOVE_FOLLOWER_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* removeFollowerSaga() {
    yield all([takeLatest(types.REMOVE_FOLLOWER_STATE, removeFollower)]);
}
