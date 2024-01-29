import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpPost,httpDelete} from "../../Helper/api";
export function* deleteFileFromCloudinary({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading:false })
        let request = {url:`/post/deleteImage`,body:payload}
        let result = yield call(httpPost,request)
        yield put({
            type: types.DELETE_FILES_FROM_CLOUDIANRY_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.DELETE_FILES_FROM_CLOUDIANRY_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* deleteFromCloudinarySaga() {
    yield all([takeLatest(types.DELETE_FILES_FROM_CLOUDIANRY_STATE, deleteFileFromCloudinary)]);
}
