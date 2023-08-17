import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, setUserData, verifyOTP} from "../../Actions/userActions";
import {toast} from 'react-toastify';
import ButtonLoader from "../ButtonLoader";
import {useTranslation} from "react-i18next";
import OTPInput from "react-otp-input";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {getStarEmail} from "../../Helper";

const VerifyOTP = () => {
    let {t} = useTranslation();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [message, setMessage] = useState('')
    const [resendDisable, setResendDisable] = useState(true);
    const [timer, setTimer] = useState(15);
    const userResult = useSelector(state => state.userData.userResult);
    const deleteAccountResult = useSelector(state => state.userData.deleteAccountResult);
    const verifyOTPResult = useSelector(state => state.userData.verifyOTPResult);
    const user = useSelector(state => state.userData.loginData);
    const loading = useSelector(state => state.userData.loading);
    const userToken = getLocalStorageData('user');
    let timeInterval;

    useEffect(() => {
        if (userResult && userResult.success) {
            setMessage(getStarEmail(user?.email))
        } else if (userResult?.error) {
            toast(userResult?.error, {type: 'error'});
        }
        // eslint-disable-next-line
    }, [userResult]);
    useEffect(()=> {
        if(deleteAccountResult?.success && deleteAccountResult?.isDelete){
            setMessage(getStarEmail(userToken?.email))
            dispatch(setUserData('loginData', {email: '', password: '', otp: '',isDelete:true,id:userToken?._id}));
        }
    },[deleteAccountResult])
    useEffect(() => {
        if (verifyOTPResult && verifyOTPResult.success) {
            if(verifyOTPResult.isDelete){
                toast('Your account deleted successfully.', {type: 'success'});
                navigate('/login');
            }else {
                toast('Login successfully.', {type: 'success'});
                navigate("/");
            }
            dispatch(setUserData('userResult', null));
            dispatch(setUserData('loginData', {email: '', password: '', otp: ''}));
        } else if (verifyOTPResult?.error) {
            toast(verifyOTPResult?.error, {type: 'error'});
            dispatch(setUserData('userResult', null));
        }
        // eslint-disable-next-line
    }, [verifyOTPResult]);
    useEffect(()=> {
        timeInterval = setInterval(()=> {
            setTimer(prev => prev - 1)
        },1000)
        return ()=> {
            clearInterval(timeInterval)
        }
    },[]);
    useEffect(()=> {
        if(timer === 0){
            setResendDisable(false);
            clearInterval(timeInterval);
        }
    },[timer])
    const handleOnChange = (value) => {
        dispatch(setUserData('loginData', {...user, ['otp']: value}))
    };
    const handleOnResend = async () => {
        setResendDisable(true);
        setTimer(15);
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
                                            className="font-bold text-5xl leading-none align-baseline">{t("Verify OTP")}</span>
                                        </div>

                                        <div className="inline-block align-center p-4 flex justify-center mr-5">
                                            <span className="text-md leading-none align-baseline">{t("Join the world's largest community")}</span>
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
                                            {t("We have sent OTP on your")} <strong> {message}.</strong> {t("Please enter OTP and verify your account.")}
                                        </div>
                                        <div className='flex justify-center w-full gap-10 '>
                                            <div className="mt-4 w-full">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">{t("Enter OTP")}</label>
                                                <OTPInput
                                                    data-testid="otp-field"
                                                    onChange={handleOnChange}
                                                    value={otp}
                                                    numInputs={6}
                                                    inputStyle='!w-[50%] h-[45px] rounded-[7px] border-[0px] ml-[8px] mr-[8px] bg-[#dddddd] text-[20px] '
                                                    renderSeparator={<span>&nbsp;&nbsp;</span>}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>

                                        </div>

                                        <div className="mt-8 md:px-32">
                                            <button id='verify'
                                                className={`text-white font-bold py-2 px-4 w-full rounded  ${loading ? 'bg-gray-200' : 'hover:bg-green-900 bg-green-500'}`}
                                                type="button" onClick={(e) => handleOnSubmit(e)}
                                                disabled={loading} data-testid="verify-otp">
                                                {loading ? <ButtonLoader/> : t("Verify")}
                                            </button>

                                            <button
                                                className={`text-white font-bold py-2 mt-5 px-4 w-full rounded  ${resendDisable ? 'bg-gray-200' : 'hover:bg-red-900 bg-red-500'}`}
                                                onClick={() => handleOnResend()} data-testid="resend-otp"
                                                disabled={resendDisable}>{t("Resend OTP")}{" "}{timer > 0 ? `(${timer})`:''}
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
