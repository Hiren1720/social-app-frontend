import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
import {setLocalStorageData} from "../../Helper/TokenHandler";
export function* setSetting({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url:'/user/' + payload.id,body:payload?.data || {}}
        let result = yield call(httpPost,request)
        if(result && result?.data){
            console.log("user result.data", result?.data)
            setLocalStorageData('user',result?.data)
        }
        yield put({
            type: types.SET_SETTING_STATE_SUCCESS,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_SETTING_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* setSettingSaga() {
    yield all([takeLatest(types.SET_SETTING_STATE, setSetting)]);
}
