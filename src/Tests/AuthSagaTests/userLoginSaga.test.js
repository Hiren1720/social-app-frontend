import {userLoginSaga,userLogin} from './../../Sagas/AuthSagas/userLoginSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpAuth} from '../../Helper/api';

describe('user login saga', () => {
    const genObject = userLoginSaga();

    it('should wait for USER_LOGIN_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('USER_LOGIN_STATE', userLogin)]));
    });

    it('should call for httpAuth and return success for valid request', () => {
        const payload = {};
        const login = userLogin({payload:payload});
        let request = {url:'/user/login',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpAuth, request));

        const result = 'result';
        expect(login.next(result).value).toEqual(put({
            type: 'USER_LOGIN_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpAuth and throw error for invalid request', () => {
        const payload = {}
        const login = userLogin({payload:payload});
        let request = {url:'/user/login',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpAuth, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "USER_LOGIN_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
