import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpFormDataAuth, httpPost} from "../../Helper/api";
import { setLocalStorageData} from "../../Helper/TokenHandler";
export function* updateUser({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true });
        let UPDATE_USER_URL = `/user/update`;
        let request = {url:UPDATE_USER_URL,body:payload};
        let result = yield call(httpFormDataAuth,request);
        yield put({
            type: types.UPDATE_USER_STATE_SUCCESS,
            payload: result,
            loading:false
        });
        if(result?.success){
            setLocalStorageData('user',result?.data);
        }

        yield put({
            type: types.GET_USER_STATE,
            payload: {type:'user'},
        });

    }
    catch (e) {
        yield put({
            type: types.UPDATE_USER_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* updateUserSaga() {
    yield all([takeLatest(types.UPDATE_USER_STATE, updateUser)]);
}
