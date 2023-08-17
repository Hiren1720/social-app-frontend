import {userRegisterSaga,userRegister} from './../../Sagas/AuthSagas/userRegistrationSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpAuth, httpPost} from '../../Helper/api';

describe('user register saga', () => {
    const genObject = userRegisterSaga();

    it('should wait for SAVE_USER_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('SAVE_USER_STATE', userRegister)]));
    });

    it('should call for httpAuth and return success for valid request', () => {
        const payload = {type:'register',formData: new FormData()};
        const register = userRegister({payload:payload});
        let request = {url:`/user/${payload?.type}`,body:payload}
        expect(register.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(register.next().value)
            .toEqual(call(payload?.type === 'update' ?httpPost: httpAuth, request));

        const result = 'result';
        expect(register.next(result).value).toEqual(put({
            type: 'SAVE_USER_STATE_RESPONSE',
            payload: "result",
            loading:false
        }));
        expect(register.next(result).value).toEqual(put({
            type: payload?.type === 'update' ? "GET_USER_STATE" : '',
            payload: {type:'user'},
        }));
    });

    it('should call for httpAuth and throw error for invalid request', () => {
        const payload = {type:'register',formData: new FormData()};
        const register = userRegister({payload:payload});
        let request = {url:`/user/${payload?.type}`,body:payload}
        expect(register.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(register.next().value)
            .toEqual(call(payload?.type === 'update' ?httpPost: httpAuth, request));

        expect(register.throw(new Error("Some error occured")).value).toEqual(put({
            type: "SAVE_USER_STATE_RESPONSE",
            payload: null,
            loading: false
        }));

    });


});
