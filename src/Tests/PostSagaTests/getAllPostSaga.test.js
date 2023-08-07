import {getAllPost,getAllPostSaga,switchUrl} from './../../Sagas/PostSagas/getAllPostSaga';

import { call, put, all, takeLatest } from 'redux-saga/effects';
import {httpGet} from '../../Helper/api';

describe('get all/saved post saga', () => {
    const genObject = getAllPostSaga();

    it('should wait for GET_POST_STATE action and return an action', () => {
        const action = { payload: 'payload' };
        expect(genObject.next(action).value).toEqual(all([takeLatest('GET_POST_STATE', getAllPost)]));
    });

    it('should call for httpGet and return success for get all post', () => {
        const payload = {type:'getAllPost',id:'1234',page:0,pageSize:10,isLoading:false};
        const login = getAllPost({payload:payload});
        let postUrl = switchUrl(payload);
        let request = `/post/${postUrl}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: payload.isLoading ? !payload.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_POST_RESPONSE',
            payload: result?.data,
            total: result.total,
            loading:false
        }));
    });

    it('should call for httpGet and return success for get saved post', () => {
        const payload = {type:'getSavedPosts',id:'1234',page:0,pageSize:10,isLoading:false};
        const login = getAllPost({payload:payload});
        let postUrl = switchUrl(payload);
        let request = `/post/${postUrl}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: payload.isLoading ? !payload.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_POST_RESPONSE',
            payload: result?.data,
            total: result.total,
            loading:false
        }));
    });

    it('should call for httpGet and return success for get PostsByUserId', () => {
        const payload = {type:'getPostsByUserId',id:'1234',page:0,pageSize:10,isLoading:false};
        const login = getAllPost({payload:payload});
        let postUrl = switchUrl(payload);
        let request = `/post/${postUrl}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: payload.isLoading ? !payload.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_POST_RESPONSE',
            payload: result?.data,
            total: result.total,
            loading:false
        }));
    });

    it('should call for httpGet and return success for get post', () => {
        const payload = {type:'getPost',id:'1234',page:0,pageSize:10,isLoading:false};
        const login = getAllPost({payload:payload});
        let postUrl = switchUrl(payload);
        let request = `/post/${postUrl}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: payload.isLoading ? !payload.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        const result = {data:[],total:0};
        expect(login.next(result).value).toEqual(put({
            type: 'GET_POST_RESPONSE',
            payload: result?.data,
            total: result.total,
            loading:false
        }));
    });

    it('should call for httpGet and throw error for invalid request', () => {
        const payload = {type:'getAllPost',id:'1234',page:0,pageSize:10,isLoading:false};
        const login = getAllPost({payload:payload});
        let postUrl = switchUrl(payload);
        let request = `/post/${postUrl}`
        expect(login.next().value).toEqual(
            put({
                type: "SET_POST_LOADING",
                loading: payload.isLoading ? !payload.isLoading : true
            })
        );
        expect(login.next().value)
            .toEqual(call(httpGet, request));

        expect(login.throw(new Error("Some error occured")).value).toEqual(put({
            type: 'GET_POST_RESPONSE',
            payload: [],
            total: 0,
            loading:false
        }));

    });


});
