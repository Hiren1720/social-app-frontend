import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function* getAllPost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading: payload ? !payload : true })
        let result = yield call(httpGet,'/post/getAllPost');
        yield put({
            type: types.GET_POST_STATE_SUCCESS,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_POST_STATE_FAILURE,
            payload: null,
            loading:false
        });
    }

}
export function* getAllPostSaga() {
    yield all([takeLatest(types.GET_POST_STATE, getAllPost)]);
}