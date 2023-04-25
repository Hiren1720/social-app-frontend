import {getCommentsSaga,getComments} from './../../Sagas/CommentSagas/getCommentsSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import { httpGet} from '../../Helper/api';

describe('get comments saga', () => {
    const genObject = getCommentsSaga();

    it('should wait for GET_COMMENT_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('GET_COMMENT_STATE', getComments)]));
    });
    it('should call for httpGet and return success for valid request', () => {
        const payload = '643c34b52acc54c88f390c82';
        const comment = getComments({payload:payload});
        let request = `/comment/getById/${payload}`
        expect(comment.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                key:'likeLoading',
                loading: true
            })
        );
        expect(comment.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[]};
        expect(comment.next(result).value).toEqual(put({
            type: 'GET_COMMENT_STATE_SUCCESS',
            payload: result?.data,
            loading:false
        }));
    });

    it('should call for httpGet and throw error for invalid request', () => {
        const payload = '643c34b52acc54c88f390c82';
        const comment = getComments({payload:payload});
        let request = `/comment/getById/${payload}`
        expect(comment.next({}).value).toEqual(
            put({
                type: "SET_POST_LOADING",
                key:'likeLoading',
                loading: true
            })
        );
        expect(comment.next().value)
            .toEqual(call(httpGet, request));

        expect(comment.throw(new Error("Some error occured")).value).toEqual(put({
            type: "GET_COMMENT_STATE_FAILURE",
            payload: null,
            loading: false
        }));

    });


});
