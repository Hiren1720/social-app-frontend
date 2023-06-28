import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    blocks: [],
    blockResult: null
}

const blockUser = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LOADING:
            return {...state, loading: action.loading};
        case types.BLOCK_USER_STATE:
            return {...state,[action.state]: action.payload};
        case types.BLOCK_USER_RESPONSE:
            return {...state, blockResult: action.payload, loading: action.loading};
        default:
            return state;
    }
};
export default blockUser;
