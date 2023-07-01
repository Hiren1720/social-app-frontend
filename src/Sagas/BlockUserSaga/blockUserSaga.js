import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost} from "../../Helper/api";
export function* blockUser({payload}) {
    try{
        yield put({ type: types.SET_BUTTON_LOADING,loading:true })
        let result = yield call(httpPost,{url:`/user/block-user`,body:payload});

        yield put({
            type: types.BLOCK_USER_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.BLOCK_USER_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* blockUserSaga() {
    yield all([takeLatest(types.BLOCK_USER_STATE, blockUser)]);
}
