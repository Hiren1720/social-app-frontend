import {userForgetPassword,userForgetPasswordSaga} from './../../Sagas/AuthSagas/forgetPasswordSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpAuth} from '../../Helper/api';

describe('forget password saga', () => {
    const genObject = userForgetPasswordSaga();

    it('should wait for FORGET_PASSWORD_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('FORGET_PASSWORD_STATE', userForgetPassword)]));
    });

    it('should call for httpAuth and return success for valid request', () => {
        const payload = {};
        const login = userForgetPassword({payload:payload});
        let request = {url:'/user/forgot-password',body:payload}
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
            type: 'FORGET_PASSWORD_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpAuth and throw error for invalid request', () => {
        const payload = {}
        const login = userForgetPassword({payload:payload});
        let request = {url:'/user/forgot-password',body:payload}
        expect(login.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpAuth, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "FORGET_PASSWORD_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
