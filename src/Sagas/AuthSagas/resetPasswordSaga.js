import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types';
import {httpAuth, httpPost} from "../../Helper/api";


export function* userResetPassword({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:`/user/${payload?.type}`,body:payload}
        let result = yield call(payload?.type === 'reset-password' ? httpAuth:httpPost,request)
        if(result && result.success && payload?.type === 'reset-password'){
            window.location.href = '/';
        }
        yield put({
            type: types.RESET_PASSWORD_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.RESET_PASSWORD_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* userResetPasswordSaga() {
    yield all([takeLatest(types.RESET_PASSWORD_STATE, userResetPassword)]);
}
