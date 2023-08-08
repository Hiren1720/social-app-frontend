import {blockUserSaga,blockUser} from './../../Sagas/BlockUserSaga/blockUserSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpPost} from '../../Helper/api';

describe('block user saga', () => {
    const genObject = blockUserSaga();

    it('should wait for BLOCK_USER_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('BLOCK_USER_STATE', blockUser)]));
    });

    it('should call for httpPost and return success for block user', () => {
        const payload = {userId: '5678', blockUserId: '1234', status: 'block'};
        const login = blockUser({payload:payload});
        let request = {url:'/user/block-user',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_BUTTON_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        const result = 'result';
        expect(login.next(result).value).toEqual(put({
            type: 'BLOCK_USER_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and return success for unBlock user', () => {
        const payload = {userId: '5678', blockUserId: '1234', status: 'unBlock'};
        const login = blockUser({payload:payload});
        let request = {url:'/user/block-user',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_BUTTON_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        const result = 'result';
        expect(login.next(result).value).toEqual(put({
            type: 'BLOCK_USER_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {}
        const login = blockUser({payload:payload});
        let request = {url:'/user/block-user',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_BUTTON_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "BLOCK_USER_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
