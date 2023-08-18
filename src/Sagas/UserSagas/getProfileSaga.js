import {
    put,
    call,
    all,
    takeEvery
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpGet} from "../../Helper/api";

export function* getProfile({payload}) {
    try{
        // yield put({ type: payload?.isLoggedInUser ? types.SET_BUTTON_LOADING : types.SET_LOADING,loading: false  })
        yield put({ type: payload?.isLoggedInUser ? types.SET_BUTTON_LOADING : types.SET_LOADING,loading: payload.isLoading ? !payload.isLoading : true  })
        let result = yield call(httpGet,`/user/${payload?.id}/profile`);
        if(payload?.isLoggedInUser){
            localStorage.setItem('user',JSON.stringify(result?.data));
        }
        yield put({
            type: types.GET_PROFILE_STATE_RESPONSE,
            payload: result?.data,
            state: payload?.isLoggedInUser ? 'loggedInUser':'profile',
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_PROFILE_STATE_RESPONSE,
            payload: null,
            state: payload?.isLoggedInUser ? 'loggedInUser':'profile',
            loading:false
        });
    }

}
export function* getProfileSaga() {
    yield all([takeEvery(types.GET_PROFILE_STATE, getProfile)]);
}
