import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpAuth} from "../../Helper/api";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";

export function* setUserStatus({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url: `/user/status`,body:payload}
        let result = yield call(httpAuth,request)
        if(result?.success) {
            let users = getLocalStorageData('users') || [];
            setLocalStorageData('user', result?.data);
            if (users?.map(ele => ele?._id).includes(result?.data?._id)) {
                let updatedUsers = users.findIndex(ele => ele?._id === result?.data?._id)
                users[updatedUsers] = result?.data;
                setLocalStorageData('users', users)
            }
        }
        yield put({
            type: types.SET_USER_STATUS_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.SET_USER_STATUS_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* setUserStatusSaga() {
    yield all([takeLatest(types.SET_USER_STATUS, setUserStatus)]);
}