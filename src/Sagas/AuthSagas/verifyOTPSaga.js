import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects'
import * as types from '../../Actions/Types'

import {httpAuth} from "../../Helper/api";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";
export function* verifyOTP({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/verify-otp',body:payload}
        let result = yield call(httpAuth,request)
        let users = getLocalStorageData('users') || [];
        if(result && result.success && result?.msg !== 'Deleted'){
            setLocalStorageData('accessToken',result.token);
            setLocalStorageData('user',result?.data);
            let user = users.findIndex(ele => ele?._id === result?.data?._id);
            if(user !== -1){
                users[user] = {...result?.data,token:result.token};
                setLocalStorageData('users',users);
            }else {
                users.push({...result?.data,token:result.token});
                setLocalStorageData('users',users);
            }
        }
        else if(result?.success && result?.msg === 'Deleted'){
            let user = getLocalStorageData('user');
            setLocalStorageData('users',users.filter(ele => ele?._id !== user?._id));
            setLocalStorageData('user',null);
            setLocalStorageData('accessToken',null);
        }
        yield put({
            type: types.VERIFY_OTP_RESPONSE,
            payload: result?.msg === 'Deleted' ? {...result,isDelete:true}:result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.VERIFY_OTP_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* verifyOTPSaga() {
    yield all([takeLatest(types.VERIFY_OTP_STATE, verifyOTP)]);
}
