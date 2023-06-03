import * as types from "./Types";

export const blockUser = (payload) =>{
    return {
        type: types.BLOCK_USER_STATE,
        payload
    }
};

