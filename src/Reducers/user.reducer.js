import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    user: {
        "name": "",
        "password": "",
        "userName": "",
        "birthDate": "",
        "email": "",
        "contact": "",
        "gender": "",
        "hobby": [],
        "state": "",
        status: false,
    },
    profile: null,
    userResult: null,
    users: []
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LOADING:
            return {...state, loading: action.loading};
        case types.SET_USER_STATE:
            return {...state, [action.state]: action.payload};
        case types.SAVE_USER_STATE_SUCCESS:
        case types.SAVE_USER_STATE_FAILURE:
        case types.USER_LOGIN_SUCCESS:
        case types.USER_LOGIN_FAILURE:
            return {...state, userResult: action.payload, loading: action.loading};
        case types.GET_USER_STATE_SUCCESS:
        case types.GET_USER_STATE_FAILURE:
            return {...state, users: action.payload, loading: action.loading};
        case types.GET_PROFILE_SUCCESS:
        case types.GET_PROFILE_FAILURE:
            return {...state, profile: action.payload, loading: action.loading};
        default:
            return state;
    }
};
export default user;