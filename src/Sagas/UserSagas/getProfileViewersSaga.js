import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types';
import {httpGet} from "../../Helper/api";

export function* getProfileViewers({payload}) {
    try{
        let result = yield call(httpGet,`/user/profile-viewers`);
        yield put({
            type: types.GET_PROFILE_VIEWERS_RESPONSE,
            payload: result?.data
        });
    }
    catch (e) {
        yield put({
            type: types.GET_PROFILE_VIEWERS_RESPONSE,
            payload: null
        });
    }

}
export function* getProfileViewersSaga() {
    yield all([takeLatest(types.GET_PROFILE_VIEWERS, getProfileViewers)]);
}