import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* updateRequest({payload}) {
    try{
        yield put({ type: types.SET_BUTTON_LOADING,loading:true });
        let UPDATE_REQUEST_URL = `/request/update/${payload.status}/${payload.id}`
        let request = {url:UPDATE_REQUEST_URL,body:{}}
        let result = yield call(httpPost,request)
        yield put({
            type: types.UPDATE_REQUEST_RESPONSE,
            payload: result,
            loading:false
        });
        yield put({
            type: types.GET_REQUEST_STATE,
            payload: {type:'user'},
        });

    }
    catch (e) {
        yield put({
            type: types.UPDATE_REQUEST_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* updateRequestSaga() {
    yield all([takeLatest(types.UPDATE_REQUEST_STATE, updateRequest)]);
}
