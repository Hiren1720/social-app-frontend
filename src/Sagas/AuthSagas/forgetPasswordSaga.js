import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types';
import {httpAuth} from "../../Helper/api";

export function* userForgetPassword({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/forgot-password',body:payload}
        let result = yield call(httpAuth,request)
        yield put({
            type: types.FORGET_PASSWORD_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.FORGET_PASSWORD_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* userForgetPasswordSaga() {
    yield all([takeLatest(types.FORGET_PASSWORD_STATE, userForgetPassword)]);
}
