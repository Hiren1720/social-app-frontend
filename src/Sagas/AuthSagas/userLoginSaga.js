import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types';
import {httpAuth} from "../../Helper/api";
import {setLocalStorageData} from "../../Helper/TokenHandler";

export function* userLogin({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/login',body:payload}
        let result = yield call(httpAuth,request)
        if(result && result.success){
            setLocalStorageData('accessToken',result.token);
            setLocalStorageData('user',result?.data);
            window.location.href = '/';
        }
        yield put({
            type: types.USER_LOGIN_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.USER_LOGIN_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* userLoginSaga() {
    yield all([takeLatest(types.USER_LOGIN_STATE, userLogin)]);
}