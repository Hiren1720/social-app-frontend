import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* setVisitorTime({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/visitorTime',body:payload || {}}
        console.log('request',request)
        let result = yield call(httpPost,request)
        yield put({
            type: types.SET_VISITOR_TIME_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_VISITOR_TIME_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* setVisitorTimeSaga() {
    yield all([takeLatest(types.SET_VISITOR_TIME, setVisitorTime)]);
}