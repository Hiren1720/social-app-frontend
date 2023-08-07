import {gerAllUsersSaga,gerAllUsers} from './../../Sagas/AuthSagas/getAllUsersSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import { httpGet} from '../../Helper/api';

describe('get all user saga', () => {
    const genObject = gerAllUsersSaga();

    it('should wait for GET_USER_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('GET_USER_STATE', gerAllUsers)]));
    });

    it('should call for httpGet and return success for valid request', () => {
        const payload = {};
        const getUser = gerAllUsers({payload:payload});
        let {page = 0,searchValue,pageSize} = payload;
        let request = `/user/userAll?page=${page}&pageSize=${pageSize}&searchValue=${searchValue}`
        expect(getUser.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(getUser.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(getUser.next(result).value).toEqual(put({
            type: 'GET_USER_STATE_RESPONSE',
            payload: result?.data,
            total: result?.total,
            loading:false
        }));
    });

    it('should call for httpGet and throw error for invalid request', () => {
        const payload = {}
        const getUser = gerAllUsers({payload:payload});
        let {page = 0,searchValue,pageSize} = payload;
        let request = `/user/userAll?page=${page}&pageSize=${pageSize}&searchValue=${searchValue}`
        expect(getUser.next().value).toEqual(
            put({
                type: "SET_LOADING",
                loading: true
            })
        );
        expect(getUser.next().value)
            .toEqual(call(httpGet, request));

        expect(getUser.throw(new Error("Some error occured")).value).toEqual(put({
            type: "GET_USER_STATE_RESPONSE",
            payload: null,
            total: 0,
            loading: false
        }));

    });


});
