import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpDelete} from "../../Helper/api";

export function* deleteAccount() {
    try{
        yield put({ type: types.SET_LOADING,loading: true })
        let result = yield call(httpDelete,{url:`/user/delete-account`,body: JSON.stringify({})});
        yield put({
            type: types.DELETE_ACCOUNT_SUCCESS,
            payload: {...result,isDelete:true},
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.DELETE_ACCOUNT_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* deleteAccountSaga() {
    yield all([takeEvery(types.DELETE_ACCOUNT_STATE, deleteAccount)]);
}