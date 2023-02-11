import * as tokenUtil from '../Helper/TokenHandler';
// let API_END_POINT = 'https://react-crud-demo.vercel.app/api'
let API_END_POINT = 'http://localhost:4040/api'

export const htpPost = async (request) => {
    return await fetch(`${API_END_POINT}${request.url}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(request.body)
    })
}
export const httpAuth = async (request) => {
    return await fetch(`${API_END_POINT}${request.url}`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(request.body)
    }).then((res)=> res.json())
}
export const httpPost = (request) => {
    let token = tokenUtil.getAccessToken();
    const url = API_END_POINT + request.url;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request.body),
    };
    return fetch(url, requestOptions)
        .then(async (response) => {
            if (response?.status === 401) {
                window.location.href = '/login';
            }
            return response
                .json()
                .then((resp) => resp)
                .catch(() => {
                    return response.status;
                });
        })
        .then((json) => json);
};
export const httpGet = (REQUEST) => {
    let token = tokenUtil.getAccessToken();;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    return fetch(`${API_END_POINT}${REQUEST}`, requestOptions)
        .then(async (response) => {
            if (response?.status === 401) {
                window.location.href='/login'
            }
            return response.json()
        })
        .then((json) => {
            return json;
        });
};
export const htpGet = async (url,data) => {
    return await fetch(`${API_END_POINT}${url}`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json'
        },
    }).then(resp => resp.json())
}

// export const htpDelete = async (url,data) => {
//     return await fetch(`${API_END_POINT}${url}`,{
//         method:'DELETE',
//         headers:{
//             'Content-Type': 'application/json'
//         },
//     }).then(resp => resp.json())
// }
// const checkAndRegenerateToken = async (response, refresh_token) => {
//     if (refresh_token) {
//         // const REFRESh_TOKEN_URL = `${window?._env_?.REACT_APP_AUTH}/Refresh?refreshToken=${refresh_token}`;
//         // var refreshToken = await httpPostRefreshToken({ url: REFRESh_TOKEN_URL, body: {} });
//         // if (!refreshToken.error) {
//         //     tokenUtil.setAccessToken(JSON.stringify(refreshToken));
//         // }
//         // else {
//             window.location.href="/login";
//         // }
//     }
//     else{
//         window.location.href="/login";
//     }
// }