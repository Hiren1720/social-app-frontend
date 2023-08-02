import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* gerAllUsers({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading: payload?.isLoading ? !payload?.isLoading : true })
        let {page = 0,searchValue,pageSize} = payload;
        let REQUEST = `/user/userAll?page=${page}&pageSize=${pageSize}&searchValue=${searchValue}`;
        let result = yield call(httpGet,REQUEST)

        yield put({
            type: types.GET_USER_STATE_RESPONSE,
            payload: result.data,
            total: result?.total,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_USER_STATE_RESPONSE,
            payload: null,
            total: 0,
            loading:false
        });
    }

}
export function* gerAllUsersSaga() {
    yield all([takeLatest(types.GET_USER_STATE, gerAllUsers)]);
}