import React, {useEffect,useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setUserData} from "../../Actions/userActions";
import {toast} from 'react-toastify';
import ButtonLoader from "../ButtonLoader";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";
import {
    LoginSocialGoogle,
} from 'reactjs-social-login';
import {useTranslation} from "react-i18next";
import {to_Encrypt} from "../../Helper/encryptDecrypt";

const url = process.env.REACT_APP_API_URL;
const Login = () => {
    let { t } = useTranslation();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const userResult = useSelector(state => state.userData.userResult);
    const user = useSelector(state => state.userData.loginData);
    const loading = useSelector(state => state.userData.loading);
    const [users, setUsers] = useState( JSON.parse(localStorage.getItem('users')) || []);
    const [remember,setRemember] = useState(false);
    const credential = getLocalStorageData('credential');

    useEffect(() => {
        if (userResult && userResult.success && userResult?.provider) {
            window.location.href = "/"
        }
        else if(userResult && userResult.success){
            rememberPassword();
            navigate("/verify-otp");
        }
        else if(userResult?.error){
            toast(userResult?.error,{type:'error'});
            dispatch(setUserData('userResult', null));
        }
        // eslint-disable-next-line
    }, [userResult]);
    const handleOnChange = (event) => {
        let {name, value} = event.target;
        dispatch(setUserData('loginData',{...user,[name]:value}))
    };
    const handleOnSubmit = async () => {
        dispatch(loginUser(user));
    };
    const rememberPassword = () => {
        if(remember && !credential){
            let password = to_Encrypt(user.password);
            setLocalStorageData('credential',{...user,password:password})
        }
    }
    const handleOnKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleOnSubmit();
        }
    };

    const handleSwitchAccount = (id) => {
        let user = users.find(ele => ele?._id === id);
        if(!user?.deActivated) {
            setLocalStorageData('accessToken', user?.token);
            setLocalStorageData('user', user || {});
            navigate('/');
        }
    };
    const handleDeleteAccount = (id) =>{
        users.splice(id, 1);
        setUsers([...users]);
        setLocalStorageData('users', users)
    };
    const {email, password} = user;
    return (
        <div>
            <div className="min-w-screen min-h-screen flex items-center p-5 lg:p-10 overflow-hidden relative">
                <div
                    className="w-full max-w-6xl rounded  shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left bg-white">
                    <div>
                        <div className="md:flex items-center -mx-10 justify-center">
                            <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                                <div className="relative">
                                    <div className="inline-block align-center flex justify-center mr-5">
                                        <span className="font-bold text-5xl leading-none align-baseline">{t("Welcome back")}</span>
                                    </div>
                                    <div className="inline-block align-center p-4 flex justify-center mr-5">
                                        <span className="text-md leading-none align-baseline">{t("Join the world's largest community")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div className='flex'>
                            <div className='flex gap-5 grid md:grid-cols-5 mt-8 lg:grid-cols-7 sm:grid-cols-4 grid-cols-3 max-[400px]:grid-cols-1   '>
                                { users ? users.map((ele,index) => (<div className="" key={index}>
                                    <div
                                        className="min-[488px]:w-[120px] max-[400px]:w-[200px]  p-2.5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                        <div className="flex justify-end">
                                            <button id="dropdownButton" data-dropdown-toggle="dropdown" onClick={()=>handleDeleteAccount(index)}
                                                    className=" sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm "
                                                    type="button">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img className="mb-3 w-16 h-16 rounded-full shadow-lg" onClick={()=>{handleSwitchAccount(ele?._id)}}
                                                 src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url:`${url}${ele?.profile_url}` : "https://flowbite.com/docs/images/people/profile-picture-3.jpg"} alt="user"/>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{ele?.name}</span>
                                        </div>
                                    </div>
                                </div>)):null}
                            </div>
                        </div>
                        <div>
                            {users.length > 0 && <div className="mt-4 flex items-center justify-between border-orange text-orange-dark p-4">
                                <span className="border-b border-2 w-1/5 md:w-2/5"/>
                                <div className="text-sm text-gray-900 font-bold uppercase">{t("OR")}</div>
                                <span className="border-b border-2 w-1/5 md:w-2/5"/>
                            </div>}
                        </div>
                        <div>
                            <div className="flex bg-white rounded-3xl overflow-hidden mx-auto ">
                                <div className="w-full py-8 lg:px-40 ">
                                    <div className='flex justify-center w-full gap-10 flex-col md:flex-row'>
                                        <div className="mt-4 w-full">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t("Email Address")}</label>
                                            <input
                                                   className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                   id="email" type="text" placeholder={t("Email")} name={"email"} data-testid="email"
                                                   value={email}
                                                   onChange={(e) => handleOnChange(e)}
                                            />
                                        </div>
                                        <div className="mt-4 w-full">
                                            <div className="flex justify-between">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">{t("Password")}</label>
                                            </div>
                                            <input id="password" type="password" placeholder={t("Password")} data-testid="password"
                                                   className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                   name={"password"}
                                                   value={password}
                                                   onChange={(e) => handleOnChange(e)}
                                                   onKeyPress={(e) => handleOnKeyPress(e)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-3 flex flex-wrap content-center mt-5">
                                            <input id="remember" type="checkbox" checked={remember} onChange={(e)=> setRemember(!remember)} className="mr-1 checked:bg-purple-700 w-8" />
                                            <label htmlFor="remember" className="mr-auto text-md font-bold">{t("Remember Username & Password")}</label>
                                            <Link to='/forget-password' className="text-md font-bold text-purple-700">{t("Forgot password?")}</Link>
                                        </div>
                                    </div>
                                    <div className="mt-8 md:px-32">
                                        <button
                                            data-testid='login'
                                            className=" text-white font-bold py-2 px-4 w-full rounded hover:bg-green-900 bg-green-500"
                                            type="button" onClick={handleOnSubmit} disabled={loading}>
                                            {loading ?
                                                <ButtonLoader/> : t("Login")}
                                        </button>
                                        <button
                                            className=" text-white font-bold py-2 mt-5 px-4 w-full rounded hover:bg-red-900 bg-red-500 "
                                            type="button" onClick={()=>navigate('/sign-up')} data-testid="sign-up" >
                                            {t("Create new account")}
                                        </button>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="border-b w-1/5 md:w-1/4"/>
                                            <span className="text-xs text-gray-500 uppercase">{t("or sign up")}</span>
                                            <span className="border-b w-1/5 md:w-1/4"/>
                                        </div>
                                        <LoginSocialGoogle
                                            client_id={process.env.REACT_APP_GG_APP_ID || ''}
                                            redirect_uri={process.env.REACT_APP_URL || ''}
                                            scope="openid profile email"
                                            discoveryDocs="claims_supported"
                                            access_type="offline"
                                            onResolve={({provider, data }) => {
                                                dispatch(loginUser({...data,provider}))
                                            }}
                                            onReject={err => {
                                                console.log(err);
                                            }}
                                        >
                                            <button
                                               className="flex items-center justify-center mt-4 px-4 w-full text-white rounded-lg shadow-md hover:bg-gray-100">
                                                <div className="px-4 py-3">
                                                    <svg className="h-6 w-6" viewBox="0 0 40 40">
                                                        <path
                                                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                                            fill="#FFC107"/>
                                                        <path
                                                            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                                                            fill="#FF3D00"/>
                                                        <path
                                                            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                                                            fill="#4CAF50"/>
                                                        <path
                                                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                                            fill="#1976D2"/>
                                                    </svg>
                                                </div>
                                                <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">{t("Sign in with Google")}</h1>
                                            </button>
                                        </LoginSocialGoogle>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-block align-bottom">
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
