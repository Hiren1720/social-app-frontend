import * as types from "./Types";
export const createPost = (payload) => {
    return {
        type: types.SET_POST_STATE,
        payload
    }
};

export const getAllPost = (payload) => {
    return {
        type: types.GET_POST_STATE,
        payload
    }
};

export const getAllLikes = (payload) => {
    return {
        type: types.GET_LIKE_STATE,
        payload
    }
};

export const createLike = (payload) => {
    return {
        type: types.SET_POST_LIKE_STATE,
        payload
    }
};