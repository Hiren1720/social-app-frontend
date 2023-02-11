import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setUserData} from "../../Actions/userActions";
import {ToastContainer, toast} from 'react-toastify';
import ButtonLoader from "../ButtonLoader";

const Login = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [user, setUser] = useState({email: "", password: ""});
    const userResult = useSelector(state => state.userData.userResult);
    const loading = useSelector(state => state.userData.loading);

    useEffect(() => {
        if (userResult && userResult.success) {
            navigate("/");
            dispatch(setUserData('userResult', null));
        }
        else if(userResult?.error){
            toast(userResult?.error,{type:'error'});
            dispatch(setUserData('userResult', null));
        }
        // eslint-disable-next-line
    }, [userResult]);
    const handleOnChange = (event) => {
        let {name, value} = event.target;
        setUser({...user, [name]: value});
    };
    const handleOnSubmit = async () => {
        dispatch(loginUser(user));
    };
    const handleOnKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleOnSubmit();
        }
    };
    const {email, password} = user;
    return (
        <>
            <div className='flex justify-center items-center mt-10'>
                <div className="w-full max-w-xs ">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Username" name={"email"}
                                value={email}
                                onChange={(e) => handleOnChange(e)}/>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password" type="password" placeholder="Password"
                                name={"password"}
                                value={password}
                                onChange={(e) => handleOnChange(e)}
                                onKeyPress={(e) => handleOnKeyPress(e)}/>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button" onClick={handleOnSubmit} disabled={loading}>
                                {loading ?
                                    <ButtonLoader/> : "Log In"}
                            </button>
                            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to='/login'>
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="flex flex-col items-start mt-2">
                            If you don't have an account?<Link to="/register" className="text-blue-500 font-bold">Sign In</Link>
                        </div>
                    </form>
                </div>
                <div
                    className="flex hidden w-[500px] h-[500px] bg-[#2d343e] justify-evenly items-center rounded-[5px] flex-col p-8">
                    <h1>Login</h1>
                    <input
                        placeholder="Enter your email"
                        name={"email"}
                        value={email}
                        onChange={(e) => handleOnChange(e)}
                        className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
                    />
                    <input
                        placeholder="Enter your password"
                        type="password"
                        name={"password"}
                        value={password}
                        onChange={(e) => handleOnChange(e)}
                        onKeyPress={(e) => handleOnKeyPress(e)}
                        className="h-[50px] w-[80%] bg-[#404450] rounded-[5px] border-none pl-[10px]"
                    />
                    <button
                        className="w-[100px] pt-[0.5rem] pr-[1rem] pb-[0.5rem] pl-[1rem] border-none bg-[#ffac41] rounded-[5px] text-[black] cursor-pointer"
                        onClick={handleOnSubmit}>Submit
                    </button>
                    <div className="flex flex-col items-start">
                        <Link to="/login" className="text-[blue]">Forgot Password?</Link>
                        If you don't have an account?<Link to="/register" className="text-[blue]">Sign In</Link>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};
export default Login;
