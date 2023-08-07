import {removeFollower,removeFollowerSaga} from './../../Sagas/FollowerSagas/removeFollowerSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpPost} from '../../Helper/api';

describe('remove following/follower saga', () => {
    const genObject = removeFollowerSaga();

    it('should wait for REMOVE_FOLLOWER_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('REMOVE_FOLLOWER_STATE', removeFollower)]));
    });

    it('should call for httpPost and return success for valid request', () => {
        const payload = {};
        const login = removeFollower({payload:payload});
        let request = {url:`/follower/removeFollower`,body:payload}
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
            type: 'REMOVE_FOLLOWER_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {}
        const login = removeFollower({payload:payload});
        let request = {url:`/follower/removeFollower`,body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_BUTTON_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpPost, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "REMOVE_FOLLOWER_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
