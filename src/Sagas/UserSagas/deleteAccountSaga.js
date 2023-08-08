import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpDelete,httpPost} from "../../Helper/api";

export function* deleteAccount({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading: true })
        let result = yield call(payload?.type === 'deactivate-account' ? httpPost : httpDelete,{url:`/user/${payload?.type}`,body: payload?.type === 'deactivate-account' ? payload : JSON.stringify({})});
        yield put({
            type: types.DELETE_ACCOUNT_RESPONSE,
            payload: {...result,isDelete:true,type:payload?.type},
            loading:false
        });
    }

    catch (e) {
        yield put({
            type: types.DELETE_ACCOUNT_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* deleteAccountSaga() {
    yield all([takeEvery(types.DELETE_ACCOUNT_STATE, deleteAccount)]);
}
