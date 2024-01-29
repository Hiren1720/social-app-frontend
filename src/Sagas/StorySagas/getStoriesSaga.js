import {all, put, call, takeEvery} from "redux-saga/effects"
import {httpGet} from "../../Helper/api";
import * as types from "../../Actions/Types"
export function* getStories(){
    try{
        let result = yield call(httpGet, "/story/getAllStories")
        yield put({
            type: types.GET_STORIES_STATE_RESPONSE,
            payload: result,
            loading:false
        });

    }
    catch (e){
        yield put({
            type: types.GET_STORIES_STATE_RESPONSE,
            payload: null,
            loading:false
        });
    }
}
export  function* getStoriesSaga(){
    yield all([takeEvery(types.GET_STORIES_STATE, getStories)])
}
