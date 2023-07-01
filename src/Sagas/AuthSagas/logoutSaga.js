import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
import {removeLocalStorageData} from "../../Helper/TokenHandler";
export function* userLogOut({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/logout',body: payload}
        let result = yield call(httpPost,request)
        if(result && result.success){
            removeLocalStorageData('accessToken');
            removeLocalStorageData('user');
            window.location.href = '/login';
        }
        yield put({
            type: types.USER_LOGOUT_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.USER_LOGOUT_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* userLogOutSaga() {
    yield all([takeLatest(types.USER_LOGOUT_STATE, userLogOut)]);
}