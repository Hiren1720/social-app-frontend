import * as types from "./Types";
export const createPost = (payload) => {
    return {
        type: types.SET_POST_STATE,
        payload
    }
};

export const resetPostResult = () => {
    return {
        type: types.SET_POST_RESPONSE,
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
        type: types.GET_LIKES_COMMENTS_STATE,
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
        type: types.DELETE_POST_STATE,
        payload
    }
};
