import * as types from "./Types";
export const createPost = (payload) => {
    return {
        type: types.SET_POST_STATE,
        payload
    }
};

export const resetPostResult = (payload) => {
    return {
        type: types.SET_POST_STATE_FAILURE,
        payload: null,
        loading:false
    }
};

export const getAllPost = (payload) => {
    return {
        type: types.GET_POST_STATE,
        payload:{isLoading:payload || false}
    }
};

export const getPost = (payload) => {
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

export const deletePost = (payload) => {
    return {
        type: types.SET_DELETE_POST_STATE,
        payload
    }
};
export const updatePost = (payload) => {
    return {
        type: types.SET_UPDATE_POST_STATE,
        payload
    }
};
