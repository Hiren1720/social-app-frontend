import React from "react"
import {httpPost} from "../../Helper/api";
import * as types from '../../Actions/Types';
import {call, all, put, takeLatest} from "redux-saga/effects"
import {sendRequest} from "../RequestSagas/sendRequestSaga";
export function* createStory({payload}) {
    try{
        // let request = {url:'/story/create',body:payload?.formData,isFormData:true}
        let request = {url:'/story/create',body:payload}
        let result = yield call(httpPost,request)

        yield put({
            type: types.CREATE_STORIES_STATE_RESPONSE,
            payload: result,
            loading:false
        });
    }
    catch (e) {
        yield put({
            type: types.CREATE_STORIES_STATE_RESPONSE,
            payload: null,
            loading:false
        });
    }
}
export function* createStoriesSaga(){
    yield all([takeLatest(types.CREATE_STORIES_STATE, createStory)]);
}
