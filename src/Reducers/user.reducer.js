import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    loginData:{
        email:'',
        password:'',
        otp:''
    },
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
    loggedInUser:null,
    profile: null,
    userResult: null,
    verifyOTPResult:null,
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
        case types.VERIFY_OTP_SUCCESS:
        case types.VERIFY_OTP_FAILURE:
            return {...state, verifyOTPResult: action.payload, loading: action.loading};
        case types.GET_USER_STATE_SUCCESS:
        case types.GET_USER_STATE_FAILURE:
            return {...state, users: action.payload, loading: action.loading};
        case types.GET_PROFILE_SUCCESS:
        case types.GET_PROFILE_FAILURE:
            return {...state, [action?.state]: action.payload, loading: action.loading};
        default:
            return state;
    }
};
export default user;