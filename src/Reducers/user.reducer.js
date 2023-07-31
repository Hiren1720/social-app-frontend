import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    loginData:{
        email:'',
        password:'',
        otp:''
    },
    forgetPassword:{
        email:''
    },
    resetPassword:{
        password:'',
        id:''
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
        'profile':{},
        status: false,
    },
    dailyUsages:[],
    profileViewers:[],
    loggedInUser:null,
    profile: null,
    userResult: null,
    verifyOTPResult:null,
    verifyForgetPasswordUser:null,
    deleteAccountResult:null,
    settingResult:null,
    users: [],
    totalUsers:0,
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_LOADING:
            return {...state, loading: action.loading};
        case types.SET_USER_STATE:
            return {...state, [action.state]: action.payload};
        case types.SAVE_USER_STATE_RESPONSE:
        case types.USER_LOGIN_RESPONSE:
        case types.RESET_PASSWORD_RESPONSE:
            return {...state, userResult: action.payload, loading: action.loading};
        case types.VERIFY_OTP_RESPONSE:
            return {...state, verifyOTPResult: action.payload, loading: action.loading};
        case types.GET_USER_STATE_RESPONSE:
            return {...state, users: action?.payload, loading: action.loading,totalUsers: action?.total};
        case types.GET_PROFILE_STATE_RESPONSE:
            return {...state, [action?.state]: action.payload,rating:action?.rating, loading: action.loading};
        case types.GET_PROFILE_VIEWERS_RESPONSE:
            return {...state, profileViewers: action.payload};
        case types.FORGET_PASSWORD_RESPONSE:
            return {...state, verifyForgetPasswordUser: action.payload, loading: action.loading}
        case types.DELETE_ACCOUNT_RESPONSE:
            return {...state,deleteAccountResult: action.payload,loading: action.loading}
        case types.SET_SETTING_STATE_SUCCESS:
        case types.SET_SETTING_STATE_FAILURE:
            return {...state,settingResult: action.payload,loading: action.loading}
        case types.GET_DAILY_USAGES_SUCCESS:
        case types.GET_DAILY_USAGES_FAILURE:
            return {...state,dailyUsages: action.payload,loading: action.loading}
        default:
            return state;
    }
};
export default user;
