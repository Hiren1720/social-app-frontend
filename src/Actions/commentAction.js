import * as types from "./Types";
export const createComment = (payload) => {
    return {
        type: types.SET_COMMENT_STATE,
        payload
    }
};

export const resetCommentResult = () => {
    return {
        type: types.SET_POST_LIKE_RESPONSE,
        payload: null,
        loading: false
    }
};