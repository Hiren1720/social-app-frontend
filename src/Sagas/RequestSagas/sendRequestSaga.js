import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* sendRequest({payload}) {
    try{
        yield put({ type: types.SET_BUTTON_LOADING,loading:true })
        let request = {url:'/request/send',body:payload}
        let result = yield call(httpPost,request)

        yield put({
            type: types.SEND_REQUEST_STATE_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SEND_REQUEST_STATE_RESPONSE,
            payload: null,
            loading:false
        });
    }
}
export function* sendRequestSaga() {
    yield all([takeLatest(types.SEND_REQUEST_STATE, sendRequest)]);
}
