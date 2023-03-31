import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setUserData, verifyOTP} from "../../Actions/userActions";
import {toast} from 'react-toastify';
import ButtonLoader from "../ButtonLoader";

const VerifyOTP = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [message,setMessage] = useState('')
    const userResult = useSelector(state => state.userData.userResult);
    const verifyOTPResult = useSelector(state => state.userData.verifyOTPResult);
    const user = useSelector(state => state.userData.loginData);
    const loading = useSelector(state => state.userData.loading);

    useEffect(() => {
        if (userResult && userResult.success) {
            let result = user?.email.indexOf("@") - 3;
            let middleEmail = user?.email.split('@')[0].slice(3,result);
            let str = '';
            for (let i = 0;i<middleEmail.length;i++){
                str += '*'
            }
            console.log('user',user?.email.replace(middleEmail,str))
            setMessage(user?.email.replace(middleEmail,str))
        }
        else if(userResult?.error){
            toast(userResult?.error,{type:'error'});
        }
        // eslint-disable-next-line
    }, [userResult]);
    useEffect(()=> {
        if (verifyOTPResult && verifyOTPResult.success) {
            navigate("/");
            dispatch(setUserData('userResult', null));
            dispatch(setUserData('loginData', {email:'',password:'',otp:''}));
        }
        else if(verifyOTPResult?.error){
            toast(verifyOTPResult?.error,{type:'error'});
            dispatch(setUserData('userResult', null));
        }
        // eslint-disable-next-line
    },[verifyOTPResult])
    const handleOnChange = (event) => {
        let {name, value} = event.target;
        dispatch(setUserData('loginData',{...user,[name]:value}))
    };
    const handleOnResend = async () => {
        dispatch(loginUser({...user,type: 'resend'}));
    };
    const handleOnSubmit = async (e,value) => {
        dispatch(verifyOTP(value ? {...user,otp:value}:{...user}));
    };
    const handleOnKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleOnSubmit();
        }
    };
    const handleKeyDown = async (event)=>{
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 'v') {
            await handleOnSubmit(event.target.value);
        }
    }
    const {otp} = user;
    return (
        <>
            <div className='flex justify-center items-center mt-10'>
                <div className="w-full max-w-xs ">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" method='GET'>
                        <div className="flex flex-col items-start mt-2 mb-3">
                            We have sent OTP on your <strong> {message}.</strong> Please enter OTP and verify your account.
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Enter OTP
                            </label>
                            <input
                                className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="otp" type="text" placeholder="Enter OTP"
                                name={"otp"}
                                value={otp}
                                onChange={(e) => handleOnChange(e)}
                                onKeyPress={(e) => handleOnKeyPress(e)}
                                onKeyUp={(e)=> handleKeyDown(e)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button" onClick={(e)=> handleOnSubmit(e)} disabled={loading}>
                                {loading ?
                                    <ButtonLoader/> : "Verify"}
                            </button>
                            <button type='button' className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={()=> handleOnResend()}>
                                Resend OTP
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default VerifyOTP;
