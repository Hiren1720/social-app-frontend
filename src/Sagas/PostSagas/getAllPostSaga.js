import {
    put,
    call,
    all,
    takeLatest
} from 'redux-saga/effects';
import * as types from '../../Actions/Types'

import {httpGet} from "../../Helper/api";
export function switchUrl({type,id,page,pageSize}) {

    switch(type){
        case 'getPost':
            return `${type}?postId=${id}`;
        case 'getPostsByUserId':
            return `${type}?id=${id}&page=${page}&pageSize=${pageSize}`;
        case 'getSavedPosts':
        case 'getAllPost':
        default:
            return `${type}?page=${page}&pageSize=${pageSize}`;
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
            total: result?.total,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.GET_POST_RESPONSE,
            payload: [],
            total:0,
            loading:false
        });
    }

}
export function* getAllPostSaga() {
    yield all([takeLatest(types.GET_POST_STATE, getAllPost)]);
}
