import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {forgetPassword, loginUser, setUserData} from "../../Actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import ButtonLoader from "../ButtonLoader";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const user = useSelector(state => state.userData.forgetPassword);
    const verifyForgetPasswordUser = useSelector(state => state.userData.verifyForgetPasswordUser);
    const loading = useSelector(state => state.userData.loading);
    const handleOnSubmit = async () => {
        dispatch(forgetPassword(user));
    };

    useEffect(() => {
        if (verifyForgetPasswordUser && verifyForgetPasswordUser.success) {
        }
        else if(verifyForgetPasswordUser?.error){
            toast(verifyForgetPasswordUser?.error,{type:'error'});
            dispatch(setUserData('verifyForgetPasswordUser', null));
        }
    }, [verifyForgetPasswordUser]);

    return (<>
        <div>
            <div className="min-w-screen min-h-screen flex items-center p-5 lg:p-10 overflow-hidden relative">
               <div
                    className="w-full max-w-6xl rounded  shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left bg-white">
                   {loading ? <div className='h-[300px] flex items-center justify-center'><ButtonLoader/> </div>:<><div>
                        <div className="md:flex items-center -mx-10 justify-center">
                            <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                                <div className="relative">
                                    <div className="inline-block align-center flex justify-center mr-5">
                                        <span
                                            className="font-bold text-5xl leading-none align-baseline">Forget Password</span>
                                    </div>
                                    <div className="inline-block align-center p-4 flex justify-center mr-5">
                                        <span className="text-md leading-none align-baseline">Remember your password?
                                        <Link className="text-blue-600 decoration-2 hover:underline font-medium" to='/login'>
                                                                  Login here
                                                               </Link></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div>
                            <div className="flex bg-white rounded-3xl overflow-hidden mx-auto ">
                                <div className="w-full py-8 lg:px-40 ">
                                    <div className='flex justify-center w-full gap-10 flex-col md:flex-row'>
                                        {verifyForgetPasswordUser?.success ? <div
                                            className=' align-center p-6 justify-center mr-5 '>
                                                <div className='text-gray-700 text-md font-bold'>I'm exicted to help you along your reset password . You just need to confirm your email.</div>
                                                <div>Click the link below to receiving your email for reset the password</div>
                                            <a className="text-blue-600 decoration-2 underline font-medium" target="_blank" href={`https://mail.google.com/mail/u/0/?hl=en/#inbox${verifyForgetPasswordUser?.data}`}>{verifyForgetPasswordUser?.data}</a>
                                        </div>:
                                        <div className="mt-4 w-full">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Email
                                                Address</label>
                                            <input
                                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                id="email" type="text" placeholder="Email" name={"email"} data-testid='email'
                                                onChange={(e)=>dispatch(setUserData('forgetPassword',{email:e.target.value}))}
                                            />
                                        </div>}

                                    </div>

                                    <div className="mt-8 md:px-32">
                                        {!verifyForgetPasswordUser?.success  && <button
                                            className=" text-white font-bold py-2 px-4 w-full rounded hover:bg-green-900 bg-green-500"
                                            type="button" onClick={()=>handleOnSubmit()} data-testid='submit'>
                                            Submit
                                        </button>}
                                        <button
                                            className=" text-white font-bold py-2 mt-5 px-4 w-full rounded hover:bg-red-900 bg-red-500 "
                                            onClick={()=>{
                                                dispatch(setUserData('verifyForgetPasswordUser', null));
                                                navigate('/login')
                                            }} data-testid='cancel'
                                            type="button">
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-block align-bottom">
                    </div></>}
                </div>
            </div>
        </div>

    </>);
}
export default ForgetPassword;

