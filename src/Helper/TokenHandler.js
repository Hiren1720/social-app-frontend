import jwt_decode from 'jwt-decode';
export const getAccessToken = () => {
   return JSON.parse(localStorage.getItem("accessToken"));
};

export const setAccessToken = (data) => {
    localStorage.setItem("accessToken", JSON.stringify(data));
};

export const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
};
export const getTokenObject = () => {
    let decoded = '';
    let token = getAccessToken();
    if (token) {
        decoded = jwt_decode(token?.accessToken);
    }
    return decoded;
};