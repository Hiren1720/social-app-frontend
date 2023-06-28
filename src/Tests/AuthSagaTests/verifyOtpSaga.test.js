import {verifyOTPSaga,verifyOTP} from './../../Sagas/AuthSagas/verifyOTPSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpAuth} from '../../Helper/api';

describe('verify otp saga', () => {
    const genObject = verifyOTPSaga();

    it('should wait for VERIFY_OTP_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('VERIFY_OTP_STATE', verifyOTP)]));
    });

    it('should call for httpAuth and return success for valid request', () => {
        const payload = {};
        const verify = verifyOTP({payload:payload});
        let request = {url:'/user/verify-otp',body:payload}
        expect(verify.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(verify.next().value)
            .toEqual(call(httpAuth, request));

        const result = 'result';
        expect(verify.next(result).value).toEqual(put({
            type: 'VERIFY_OTP_RESPONSE',
            payload: "result",
            loading:false
        }));
    });

    it('should call for httpAuth and throw error for invalid request', () => {
        const payload = {}
        const verify = verifyOTP({payload:payload});
        let request = {url:'/user/verify-otp',body:payload}
        expect(verify.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(verify.next().value)
            .toEqual(call(httpAuth, request));

        expect(verify.throw(new Error("Some error occured")).value).toEqual(put({
            type: "VERIFY_OTP_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
