import {getFollowers,getFollowersSaga} from './../../Sagas/FollowerSagas/getFollowersSaga';

import { call, put, all, takeEvery } from 'redux-saga/effects';
import {httpGet} from '../../Helper/api';

describe('get followers/followings saga', () => {
    const genObject = getFollowersSaga();

    it('should wait for GET_FOLLOWERS_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeEvery('GET_FOLLOWERS_STATE', getFollowers)]));
    });

    it('should call for httpGet and return success for get followers', () => {
        const payload = {isLoading:false,type:'Followers',page:0,pageSize:10,id:'1234567890'};
        const login = getFollowers({payload:payload});
        const {page=0,pageSize=10,type,id} = payload;
        let request = `/follower/get?type=${type}&id=${id}&page=${page}&pageSize=${pageSize}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_FOLLOWER_LOADING",
                loading: payload?.isLoading ? !payload?.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_FOLLOWERS_STATE_RESPONSE',
            payload: result?.data || null,
            total: result?.total,
            loading:false
        }));
    });

    it('should call for httpGet and return success for get followings', () => {
        const payload = {isLoading:false,type:'Followings',page:0,pageSize:10,id:'1234567890'};
        const login = getFollowers({payload:payload});
        const {page=0,pageSize=10,type,id} = payload;
        let request = `/follower/get?type=${type}&id=${id}&page=${page}&pageSize=${pageSize}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_FOLLOWER_LOADING",
                loading: payload?.isLoading ? !payload?.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_FOLLOWERS_STATE_RESPONSE',
            payload: result?.data || null,
            total: result?.total,
            loading:false
        }));
    });

    it('should call for httpGet and throw error for invalid request', () => {
        const payload = {isLoading:false,type:'Followings',page:0,pageSize:10,id:'1234567890'}
        const login = getFollowers({payload:payload});
        const {page=0,pageSize=10,type,id} = payload;
        let request = `/follower/get?type=${type}&id=${id}&page=${page}&pageSize=${pageSize}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_FOLLOWER_LOADING",
                loading: payload?.isLoading ? !payload?.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: "GET_FOLLOWERS_STATE_RESPONSE",
            payload: null,
            total:0,
            loading: false
        }));

    });


});
