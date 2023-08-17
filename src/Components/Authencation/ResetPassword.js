import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {resetPassword, setUserData} from "../../Actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {toast} from "react-toastify";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const user = useSelector(state => state.userData.resetPassword);
    const [passwordValue, setPasswordValue] = useState({password: '', confirmPassword: ''});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = useParams();
    const handleOnChange = (e) => {
        setPasswordValue({...passwordValue, [e.target.name]: e.target.value})
        dispatch(setUserData('resetPassword', {id: id?.id, password: e.target.value}))
    }
    const handlePassword = (e) => {
        if (passwordValue.password === passwordValue.confirmPassword) {
            dispatch(resetPassword({...user,type:'reset-password'}));
        } else {
            toast("Password not match to confirm password", {type: 'error'});
        }
    };
    return (<>
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
                                            className="font-bold text-5xl leading-none align-baseline">Reset Password</span>
                                    </div>
                                    <div className="inline-block align-center p-4 flex justify-center mr-5">
                                        <span className="text-md leading-none align-baseline">Remember your password?
                                        <Link className="text-blue-600 decoration-2 hover:underline font-medium"
                                              to='/login'>
                                                Login here </Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div className='flex'>
                            <div
                                className='flex gap-5 grid md:grid-cols-5 mt-8 lg:grid-cols-7 sm:grid-cols-4 grid-cols-3 max-[400px]:grid-cols-1'>
                            </div>
                        </div>
                        <div>
                        </div>
                        <div>
                            <div className="flex bg-white rounded-3xl overflow-hidden mx-auto ">
                                <div className="w-full py-8 lg:px-40 ">
                                    <div className='flex justify-center w-full gap-10 flex-col md:flex-row'>
                                        <div className="mt-4 w-full">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">New
                                                Password</label>
                                            <input
                                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                id="new password" type={showPassword ? "text" : "password"}
                                                placeholder="password" name={"password"}
                                                onChange={(e) => handleOnChange(e)} data-testid='new-password'
                                            />
                                        </div>

                                        <div className="mt-4 w-full">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Confirmation
                                                Password</label>
                                            <input
                                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                id="confirm password" type={showPassword ? "text" : "password"}
                                                placeholder="confirm password" name={"confirmPassword"} data-testid='confirm-password'
                                                onChange={(e) => setPasswordValue({
                                                    ...passwordValue,
                                                    confirmPassword: e.target.value
                                                })}
                                            />
                                        </div>

                                    </div>
                                    <div>
                                        <div className="mb-3 flex flex-wrap content-center mt-5">
                                            <input id="remember" type="checkbox"
                                                   className="mr-1 checked:bg-purple-700 w-8"
                                                   onClick={() => setShowPassword(!showPassword)}/>
                                            <label htmlFor="remember" className="mr-auto text-md font-bold">Show
                                                password</label>

                                        </div>
                                    </div>
                                    <div className="mt-8 md:px-32">
                                        <button
                                            className=" text-white font-bold py-2 px-4 w-full rounded hover:bg-green-900 bg-green-500"
                                            onClick={() => handlePassword()} data-testid='submit'
                                            type="button">
                                            Submit
                                        </button>
                                        <button
                                            className=" text-white font-bold py-2 mt-5 px-4 w-full rounded hover:bg-red-900 bg-red-500 "
                                            onClick={() => navigate('/login')} data-testid='cancel'
                                            type="button">
                                            Cancel
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

    </>);
}
export default ResetPassword;

