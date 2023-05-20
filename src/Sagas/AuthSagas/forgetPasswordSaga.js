import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types';
import {httpAuth} from "../../Helper/api";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";

export function* userForgetPassword({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/forgot-password',body:payload}
        let result = yield call(httpAuth,request)
        if(result && result.success){
            // setLocalStorageData('accessToken',result.token);
            // setLocalStorageData('user',result?.data);
            // let users = getLocalStorageData('users') || [];
            // let user = users.findIndex(ele => ele?._id === result?.data?._id)
            // if(user !== -1){
            //     users[user] = {...result?.data,token:result.token};
            //     setLocalStorageData('users',users);
            // }else {
            //     users.push({...result?.data,token:result.token});
            //     setLocalStorageData('users',users);
            // }
            // window.location.href = '/';
        }
        yield put({
            type: types.FORGET_PASSWORD_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.FORGET_PASSWORD_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* userForgetPasswordSaga() {
    yield all([takeLatest(types.FORGET_PASSWORD_STATE, userForgetPassword)]);
}
