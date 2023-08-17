import {createPost,createPostSaga} from './../../Sagas/PostSagas/createPostSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpPost} from '../../Helper/api';

describe('create & update post saga', () => {
    const genObject = createPostSaga();

    it('should wait for SET_POST_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('SET_POST_STATE', createPost)]));
    });

    it('should call for httpPost and return success for create post', () => {
        const payload = {type:'create',formData: new FormData()};
        const login = createPost({payload:payload});
        let request = {url:`/post/${payload?.type}`,body:payload}
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
            type: 'SET_POST_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and return success for update post', () => {
        const payload = {type:'update',formData: new FormData()};
        const login = createPost({payload:payload});
        let request = {url:`/post/${payload?.type}`,body:payload}
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
            type: 'SET_POST_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {type:'create',formData:new FormData()}
        const login = createPost({payload:payload});
        let request = {url:`/post/${payload?.type}`,body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "SET_POST_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
