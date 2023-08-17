import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpAuth, httpPost} from "../../Helper/api";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";

export function* userRegister({payload}) {
    try{
        yield put({ type: types.SET_LOADING,loading:true })
        let request = {url: `/user/${payload?.type}`,body:payload}
        // let request = {url: `/user/${payload?.type}`,body:payload?.formData,isFormData:payload?.type === 'update'}
        // let result = payload?.type === 'update' ? yield call(httpPost,request) : yield call(httpFormDataAuth,request)
        let result = payload?.type === 'update' ? yield call(httpPost,request) : yield call(httpAuth,request);
        if(payload?.type === 'update' && result?.success) {
            setLocalStorageData('user', result?.data);
            let users = getLocalStorageData('users') || [];
            if (users?.map(ele => ele?._id).includes(result?.data?._id)) {
                let updatedUsers = users.findIndex(ele => ele?._id === result?.data?._id)
                users[updatedUsers] = result?.data;
                setLocalStorageData('users', users)
            }
        }
        yield put({
            type: types.SAVE_USER_STATE_RESPONSE,
            payload: result,
            loading:false
        });

        yield put({
            type: payload?.type === 'update' ? types.GET_USER_STATE : '',
            payload: {type:'user'},
        });
    }
    catch (e) {
        yield put({
            type: types.SAVE_USER_STATE_RESPONSE,
            payload: null,
            loading:false
        });
    }

}
export function* userRegisterSaga() {
    yield all([takeLatest(types.SAVE_USER_STATE, userRegister)]);
}
