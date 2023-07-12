import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
function switchUrl({type,id}) {
    switch(type){
        case 'getPost':
            return `${type}?postId=${id}`;
        case 'getPostsByUserId':
            return `${type}?id=${id}`;
        case 'getSavedPosts':
        case 'getAllPost':
        default:
            return type;
    }
}
export function* getAllPost({payload}) {
    try{
        yield put({ type: types.SET_POST_LOADING,loading: payload.isLoading ? !payload.isLoading : true });
        let postUrl = switchUrl(payload);
        let result = yield call(httpGet,`/post/${postUrl}`);
        yield put({
            type: types.GET_POST_RESPONSE,
            payload: (result?.data && result?.data.length) ? result?.data: [],
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_POST_RESPONSE,
            payload: [],
            loading:false
        });
    }

}
export function* getAllPostSaga() {
    yield all([takeLatest(types.GET_POST_STATE, getAllPost)]);
}