import * as types from "./Types";

export const createStories = (payload) =>{
    return {
        type: types.CREATE_STORIES_STATE,
        payload
    }
};

export const getStories = () =>{
    return {
        type: types.GET_STORIES_STATE
    }
};
