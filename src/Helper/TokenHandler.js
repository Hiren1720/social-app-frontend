// import jwt_decode from 'jwt-decode';
// export const getAccessToken = () => {
//     return JSON.parse(localStorage.getItem("accessToken"));
// };
//
// export const setAccessToken = (data) => {
//     localStorage.setItem("accessToken", JSON.stringify(data));
//     let user = jwt_decode(data?.accessToken);
//     localStorage.setItem('user',JSON.stringify(jwt_decode(data?.accessToken)));
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     if(!users.map((ele)=> ele?._id).includes(user?._id)){
//         users.push({...user,token:data});
//         localStorage.setItem('users',JSON.stringify(users))
//     }
//     setLocalStorageData('accessToken',result.token);
//     setLocalStorageData('user',result?.data);
// };


export const getLocalStorageData = (key) => {
   return JSON.parse(localStorage.getItem(key));
};
export const setLocalStorageData = (key,data) => {
    localStorage.setItem(key, JSON.stringify(data));

}

export const removeLocalStorageData = (key) => {
    localStorage.removeItem(key);
};


//
// export const removeAccessToken = () => {
//     localStorage.removeItem("accessToken");
// };
//
// export const getToken = () => {
//     let decoded = '';
//     let token = getAccessToken();
//
//     if (token) {
//         decoded = jwt_decode(token?.accessToken);
//     }
//     return decoded;
// };
//
// export const getTokenObject = () => {
//     return JSON.parse(localStorage.getItem('user')) || '';
// };
