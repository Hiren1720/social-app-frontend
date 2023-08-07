import {createCommentSaga,createComment} from './../../Sagas/CommentSagas/createCommentSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpPost} from '../../Helper/api';

describe('post comment saga', () => {
    const genObject = createCommentSaga();

    it('should wait for SET_COMMENT_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('SET_COMMENT_STATE', createComment)]));
    });

    it('should call for httpPost and return success for valid request', () => {
        const payload = {};
        const login = createComment({payload:payload});
        let request = {url:'/post/comment',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                key:'commentLoading',
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        const result = 'result';
        expect(login.next(result).value).toEqual(put({
            type: 'SET_COMMENT_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {}
        const login = createComment({payload:payload});
        let request = {url:'/post/comment',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                key:'commentLoading',
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "SET_COMMENT_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
