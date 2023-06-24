import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getDailyUsages({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = '/user/getDailyUsage';
        let result = yield call(httpGet,request);
        yield put({
            type: types.GET_DAILY_USAGES_SUCCESS,
            payload: result?.data || [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_DAILY_USAGES_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* getDailyUsagesSaga() {
    yield all([takeLatest(types.GET_DAILY_USAGES, getDailyUsages)]);
}