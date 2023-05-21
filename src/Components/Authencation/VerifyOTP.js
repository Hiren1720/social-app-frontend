import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setUserData, verifyOTP} from "../../Actions/userActions";
import {toast} from 'react-toastify';

const VerifyOTP = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [message, setMessage] = useState('')
    const [ableResendBtn, setAbleResendBtn] = useState(false);
    const userResult = useSelector(state => state.userData.userResult);
    const verifyOTPResult = useSelector(state => state.userData.verifyOTPResult);
    const user = useSelector(state => state.userData.loginData);
    const loading = useSelector(state => state.userData.loading);

    useEffect(() => {
        if (userResult && userResult.success) {
            let result = user?.email.indexOf("@") - 3;
            let middleEmail = user?.email.split('@')[0].slice(3, result);
            let str = '';
            for (let i = 0; i < middleEmail.length; i++) {
                str += '*'
            }
            console.log('user', user?.email.replace(middleEmail, str))
            setMessage(user?.email.replace(middleEmail, str))
        } else if (userResult?.error) {
            setAbleResendBtn(!ableResendBtn)
            toast(userResult?.error, {type: 'error'});
        }
        // eslint-disable-next-line
    }, [userResult]);
    useEffect(() => {
        if (verifyOTPResult && verifyOTPResult.success) {
            navigate("/");
            dispatch(setUserData('userResult', null));
            dispatch(setUserData('loginData', {email: '', password: '', otp: ''}));
        } else if (verifyOTPResult?.error) {
            setAbleResendBtn(true)
            toast(verifyOTPResult?.error, {type: 'error'});
            dispatch(setUserData('userResult', null));
        }
        // eslint-disable-next-line
    }, [verifyOTPResult])
    const handleOnChange = (event) => {
        let {name, value} = event.target;
        dispatch(setUserData('loginData', {...user, [name]: value}))
        if (ableResendBtn) {
            setAbleResendBtn(false)
        }
    };
    const handleOnResend = async () => {

        dispatch(loginUser({...user, type: 'resend'}));
        dispatch(setUserData('loginData', {...user, otp: ''}));
    };
    const handleOnSubmit = async (e, value) => {
        dispatch(verifyOTP(value ? {...user, otp: value} : {...user}));
    };
    const handleOnKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleOnSubmit();
        }
    };
    const handleKeyDown = async (event) => {

        let charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
            await handleOnSubmit(event.target.value);
        }
    }
    const {otp} = user;
    return (
        <>
            <div>
                <div className="min-w-screen min-h-screen flex items-center p-5 lg:p-10 overflow-hidden relative">
                    <div
                        className="w-full max-w-6xl rounded  shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left bg-white">
                        <div>
                            <div className="md:flex items-center -mx-10 justify-center">
                                <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                                    <div className="relative">
                                        <div className="inline-block align-center flex justify-center mr-5">
                                        <span
                                            className="font-bold text-5xl leading-none align-baseline">Verify OTP</span>
                                        </div>

                                        <div className="inline-block align-center p-4 flex justify-center mr-5">
                                            <span className="text-md leading-none align-baseline">Join the world's largest community</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex-col'>
                            <div>
                                <div className="flex bg-white rounded-3xl overflow-hidden mx-auto ">
                                    <div className="w-full py-8 lg:px-40 ">
                                        <div className="flex items-start mt-2 mb-3">
                                            We have sent OTP on your <strong> {message}.</strong> Please enter OTP and
                                            verify your account.
                                        </div>
                                        <div className='flex justify-center w-full gap-10 '>
                                            <div className="mt-4 w-full">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Enter
                                                    OTP</label>
                                                <input
                                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                    id="otp" type="text" placeholder="Enter OTP"
                                                    name={"otp"}
                                                    value={otp}
                                                    onChange={(e) => handleOnChange(e)}
                                                    onKeyPress={(e) => handleOnKeyPress(e)}
                                                    onKeyUp={(e) => handleKeyDown(e)}
                                                />
                                            </div>

                                        </div>

                                        <div className="mt-8 md:px-32">
                                            <button
                                                className={`text-white font-bold py-2 px-4 w-full rounded  ${ableResendBtn ? 'bg-gray-200' : 'hover:bg-green-900 bg-green-500'}`}
                                                type="button" onClick={(e) => handleOnSubmit(e)}
                                                disabled={loading || ableResendBtn}>
                                                Verify
                                            </button>

                                            <button
                                                className={`text-white font-bold py-2 mt-5 px-4 w-full rounded  ${!ableResendBtn ? 'bg-gray-200' : 'hover:bg-red-900 bg-red-500'}`}
                                                onClick={() => handleOnResend()}
                                                disabled={loading || !ableResendBtn}>Resend OTP
                                            </button>

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
        </>
    );
};
export default VerifyOTP;
