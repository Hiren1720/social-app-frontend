import {userLogOutSaga,userLogOut} from './../../Sagas/AuthSagas/logoutSaga';

import { take, call, race, put, all, takeLatest } from 'redux-saga/effects';
import { httpPost } from '../../Helper/api';

describe('user log out saga', () => {
    const genObject = userLogOutSaga();

    it('should wait for USER_LOGOUT_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('USER_LOGOUT_STATE', userLogOut)]));
    });

    it('should call for httpPost and return success for valid request', () => {
        const payload = {};
        const logOut = userLogOut({payload:payload});
        let request = {url:'/user/logout',body:payload}
        expect(logOut.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(logOut.next().value)
            .toEqual(call(httpPost, request));

        const result = 'result';
        expect(logOut.next(result).value).toEqual(put({
            type: 'USER_LOGOUT_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpPost and throw error for invalid request', () => {
        const payload = {}
        const logOut = userLogOut({payload:payload});
        let request = {url:'/user/logout',body:payload}
        expect(logOut.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(logOut.next().value)
            .toEqual(call(httpPost, request));

        expect(logOut.throw(new Error("Some error occured")).value).toEqual(put({
            type: "USER_LOGOUT_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
