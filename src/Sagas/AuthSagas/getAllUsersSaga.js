import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* gerAllUsers() {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let REQUEST = '/user/userAll'
        let result = yield call(httpGet,REQUEST)

        yield put({
            type: types.GET_USER_STATE_SUCCESS,
            payload: result.data,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_USER_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* gerAllUsersSaga() {
    yield all([takeLatest(types.GET_USER_STATE, gerAllUsers)]);
}