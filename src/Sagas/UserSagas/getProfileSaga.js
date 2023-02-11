import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getProfile({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let result = yield call(httpGet,`/user/profile/${payload?.id}`);

        yield put({
            type: types.GET_PROFILE_SUCCESS,
            payload: result?.data,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_PROFILE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* getProfileSaga() {
    yield all([takeLatest(types.GET_PROFILE_STATE, getProfile)]);
}