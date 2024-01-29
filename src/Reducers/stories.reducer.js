import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    storiesResult: null,
    stories: [],
    story: {
        "story_url": "",
    },
}

const stories =  (state = initialState, action) => {
    switch (action.type) {
        case types.GET_STORIES_STATE_RESPONSE:
            return {...state, stories: action.payload, loading: action.loading};
        case types.CREATE_STORIES_STATE_RESPONSE:
            return {...state, storiesResult: action.payload, loading: action.loading};
        default:
            return state;
    }
};
export default stories;
