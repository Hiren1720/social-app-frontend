import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getRequests({payload}) {
    try{
        yield put({ type: types.SET_BUTTON_LOADING,loading:true })
        let result = yield call(httpGet,`/request/${payload?.type}/requestGetByType`)

        yield put({
            type: types.GET_REQUEST_STATE_RESPONSE,
            payload: result,
            state: payload?.type === 'user' ? 'userRequests':'requests',
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_REQUEST_STATE_RESPONSE,
            payload: null,
            state: payload?.type === 'user' ? 'userRequests':'requests',
            loading:false
        });
    }

}
export function* getRequestsSaga() {
    yield all([takeEvery(types.GET_REQUEST_STATE, getRequests)]);
}