import * as types from "./Types";
export const createComment = (payload) => {
    return {
        type: types.SET_COMMENT_STATE,
        payload
    }
};

export const getCommentsById = (payload) => {
    return {
        type: types.GET_COMMENT_STATE,
        payload
    }
};

export const resetCommentResult = () => {
    return {
        type: types.SET_COMMENT_RESPONSE,
        payload: null,
        loading: false
    }
};