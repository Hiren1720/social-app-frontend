import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    requestResult: null,
    requests: [],
    userRequests:[],
    followFollowing:[],
    buttonLoading:false,
    totalUsers: 0
}

const request =  (state = initialState, action) => {
    switch (action.type) {
        case types.SET_FOLLOWER_LOADING:
        case types.SET_LOADING:
            return {...state, loading: action.loading};
        case types.SET_BUTTON_LOADING:
            return {...state,buttonLoading:action?.loading}
        case types.SEND_REQUEST_STATE_RESPONSE:
        case types.REMOVE_FOLLOWER_RESPONSE:
        case types.UPDATE_REQUEST_RESPONSE:
            return {...state, requestResult: action.payload, buttonLoading: action.loading};
        case types.GET_REQUEST_STATE_RESPONSE:
            return {...state, [action.state]: action.payload, buttonLoading: action.loading};
        case types.SET_REQUEST_STATE:
            return {...state, requestResult: action.payload};
        case types.GET_FOLLOWERS_STATE_RESPONSE:
            return {...state, followFollowing: action.payload, loading: action.loading,totalUsers: action?.total};
        default:
            return state;
    }
};
export default request;
