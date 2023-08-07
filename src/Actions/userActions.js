import * as types from "./Types";

export const registerUser = (payload) =>{
    return {
        type: types.SAVE_USER_STATE,
        payload
    }
};
export const setUserData = (state,payload) =>{
    return {
        type: types.SET_USER_STATE,
        state: state,
        payload:payload
    }
};

export const loginUser = (payload) =>{
    return {
        type: types.USER_LOGIN_STATE,
        payload
    }
};

export const getProfileViewers = (payload) =>{
    return {
        type: types.GET_PROFILE_VIEWERS,
        payload
    }
};

export const verifyOTP = (payload) =>{
    return {
        type: types.VERIFY_OTP_STATE,
        payload
    }
};

export const getAllUsers = (payload) =>{
    return {
        type: types.GET_USER_STATE,
        payload
    }
};

export const logout = (payload = {}) =>{
    return {
        type: types.USER_LOGOUT_STATE,
        payload
    }
};

export const deleteAccount = (payload = {}) =>{
    return {
        type: types.DELETE_ACCOUNT_STATE,
        payload
    }
};
export const resetUserResult = () =>{
    return {
        type: types.DELETE_ACCOUNT_RESPONSE,
        payload:null,
        loading:false
    }
};

export const getProfile = (payload) =>{
    return {
        type: types.GET_PROFILE_STATE,
        payload
    }
};

export const savePost = (payload) =>{
    return {
        type: types.SAVE_POST_STATE,
        payload
    }
};

export const forgetPassword = (payload) =>{
    return {
        type: types.FORGET_PASSWORD_STATE,
        payload
    }
};


export const resetPassword = (payload) =>{
    return {
        type: types.RESET_PASSWORD_STATE,
        payload
    }
};

export const setSettings = (payload) =>{
    return {
        type: types.SET_SETTING_STATE,
        payload
    }
};

export const setUserStatus = (payload) => {
    return {
        type: types.SET_USER_STATUS,
        payload
    }
};

export const resetSettingResult = () => {
    return {
        type: types.SET_SETTING_STATE_FAILURE,
        payload:null,
        loading:false
    }
}

export const createVisitorTime = (payload) => {
    return {
        type: types.SET_VISITOR_TIME,
        payload
    }
}

export const getDailyUsages = (payload) => {
    return {
        type: types.GET_DAILY_USAGES,
        payload
    }
}
