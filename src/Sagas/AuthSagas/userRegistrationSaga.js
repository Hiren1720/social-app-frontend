import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpFormDataAuth} from "../../Helper/api";

export function* userRegister({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/register',body:payload}
        let result = yield call(httpFormDataAuth,request)
        yield put({
            type: types.SAVE_USER_STATE_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SAVE_USER_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* userRegisterSaga() {
    yield all([takeLatest(types.SAVE_USER_STATE, userRegister)]);
}