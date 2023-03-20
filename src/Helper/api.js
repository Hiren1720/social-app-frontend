import * as tokenUtil from '../Helper/TokenHandler';
let API_END_POINT = 'https://social-app-backend-weld.vercel.app/api'
// let API_END_POINT = 'http://localhost:4040/api'

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
            'Authorization': `Bearer ${token?.accessToken}`
        },
        body: JSON.stringify(request.body),
    };
    return fetch(url, requestOptions)
        .then(async (response) => {
            if (response?.status === 401) {
                await checkAndRegenerateToken(token?.refreshToken);
                return httpGet(request);
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
    let token = tokenUtil.getAccessToken();
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token?.accessToken}`
        }
    };
    return fetch(`${API_END_POINT}${REQUEST}`, requestOptions)
        .then(async (response) => {
            if (response?.status === 401) {
                await checkAndRegenerateToken(token?.refreshToken);
                return httpGet(REQUEST);
            }
            return response.json()
        })
        .then((json) => {
            return json;
        });
};

const checkAndRegenerateToken = async (refresh_token) => {
    if (refresh_token) {
        let data = await httpAuth({ url: '/user/refreshToken', body: {refreshToken:refresh_token} });
        if (data.success) {
            tokenUtil.setAccessToken(data?.token);
        }
        else {
            window.location.href="/login";
        }
    }
    else{
        window.location.href="/login";
    }
}