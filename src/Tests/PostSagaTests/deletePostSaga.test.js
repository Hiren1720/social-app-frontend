import {deletePost,deletePostSaga} from './../../Sagas/PostSagas/deletePostSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpPost} from '../../Helper/api';

describe('delete post saga', () => {
    const genObject = deletePostSaga();

    it('should wait for DELETE_POST_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('DELETE_POST_STATE', deletePost)]));
    });

    it('should call for httpPost and return success for create post', () => {
        const payload = {_id:'1234567890'};
        const login = deletePost({payload:payload});
        let request = {url:`/post/deletePost/${payload?._id}`,body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        const result = 'result';
        expect(login.next(result).value).toEqual(put({
            type: 'DELETE_POST_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {_id:'1234567890'}
        const login = deletePost({payload:payload});
        let request = {url:`/post/deletePost/${payload?._id}`,body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "DELETE_POST_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
