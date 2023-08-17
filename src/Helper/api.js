import * as tokenUtil from '../Helper/TokenHandler';
const API_END_POINT = `${process.env.REACT_APP_API_URL}/api`;

export const httpAuth = async (request) => {
    return await fetch(`${API_END_POINT}${request.url}`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(request.body)
    }).then((res)=> res.json())
}
// export const httpFormDataAuth = async (request) => {
//     return await fetch(`${API_END_POINT}${request.url}`,{
//         method:'POST',
//         body:request.body
//     }).then((res)=> res.json())
// }

export const httpFormDataAuth = async (request) => {
    return await fetch(`${API_END_POINT}${request.url}`,{
        method:'POST',
        body:JSON.stringify(request.body)
    }).then((res)=> res.json())
};

export const httpDelete = async (request) => {
    let token = tokenUtil.getLocalStorageData('accessToken');
    return await fetch(`${API_END_POINT}${request.url}`,{
        method:'DELETE',
        headers:{
            'Authorization': `Bearer ${token?.accessToken}`
        },
        body:request?.body
    }).then(async (response)=> {
        if (response?.status === 401) {
            let data = await checkAndRegenerateToken(token?.refreshToken);
            return data ? await httpDelete(request):null;
        }
        return response.json();
    }).then((json) => json);
}
export const httpPost = (request) => {
    let token = tokenUtil.getLocalStorageData('accessToken');
    const url = API_END_POINT + request.url;
    let headers = request?.isFormData ? {
        'Authorization': `Bearer ${token?.accessToken}`
    }:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.accessToken}`
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: request?.isFormData ? request?.body : JSON.stringify(request.body),
    };
    return fetch(url, requestOptions)
        .then(async (response) => {
            if (response?.status === 401) {
                let data = await checkAndRegenerateToken(token?.refreshToken);
                return data ? await httpPost(request):null;
            }
            return response.json();
        })
        .then((json) => json);
};
export const httpGet = (REQUEST) => {
    let token = tokenUtil.getLocalStorageData('accessToken');
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
                let data = await checkAndRegenerateToken(token?.refreshToken);
                return data ? await httpGet(REQUEST):null;
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
            tokenUtil.setLocalStorageData('accessToken',data?.token);
            return true;
        }
        else {
            return updateLocalStorage();
        }
    }
    else{
        return updateLocalStorage();
    }
}

export const updateLocalStorage = () => {
    tokenUtil.removeLocalStorageData('accessToken');
    let user = tokenUtil.getLocalStorageData('user');
    let users = tokenUtil.getLocalStorageData('users');
    tokenUtil.setLocalStorageData('users',users.filter(ele => ele?._id !== user._id));
    tokenUtil.removeLocalStorageData('user');
    window.location.href="/login";
    return false;
}
