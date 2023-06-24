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

export const getProfile = (payload) =>{
    return {
        type: types.GET_PROFILE_STATE,
        payload
    }
};

export const getSavedPost = (payload) =>{
    return {
        type: types.SET_SAVED_POST_STATE,
        payload
    }
};

export const getAllSavedPost = (payload) =>{
    return {
        type: types.GET_SAVED_POST_STATE,
        payload
    }
};

export const updateUser = (payload) =>{
    return {
        type: types.UPDATE_USER_STATE,
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
