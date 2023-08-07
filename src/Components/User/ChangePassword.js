import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {resetPassword} from "../../Actions/userActions";
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";
import {BiShow,BiHide} from "react-icons/bi"

const ChangePassword = ()=>{
    const dispatch = useDispatch();
    const navigate= useNavigate()
    const changePasswordObject = {oldPassword:'',newPassword:'',repeatPassword:''}
    const [passwordReset,setPasswordReset] = useState(changePasswordObject);
    const handleOnPasswordChange = useCallback((e) => {
        let {name,value} = e.target;
        setPasswordReset({...passwordReset,[name]:value});
    },[passwordReset]);
    const userResult = useSelector(state => state.userData.userResult);
    const [error, setError] = useState(changePasswordObject)
    const [show , setShow] = useState({oldPassword: false, newPassword: false, repeatPassword: false})
    const updatePassword = () => {
        const {oldPassword, newPassword, repeatPassword} = passwordReset
        let msg = "field is required";
        const errors = {};
        if (!oldPassword) errors.oldPassword = 'Old Password' + ' ' + msg;
        if (!newPassword) errors.newPassword = 'New Password' + ' ' + msg;
        if (!repeatPassword) errors.repeatPassword = 'Repeat Password' + ' ' + msg;
        if (Object.keys(errors).length === 0) {
            if (newPassword === repeatPassword) {
                dispatch(resetPassword({...passwordReset, type: 'update-password'}))
                setPasswordReset(changePasswordObject)
            }else {
                errors.repeatPassword = 'Repeat password is not match with new password';
            }
        }
        setError(errors);
    }
    useEffect(()=>{

    },[userResult])
    const {oldPassword,newPassword,repeatPassword} = passwordReset;
    return(
        <div className="px-3 flex items-center bg-grey-light cursor-pointer">
            <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div className="relative  items-bottom justify-between">
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                        <div className='relative flex items-center'>
                        <span className="absolute right-3 flex text-gray-500 cursor-pointer" onClick={()=>setShow({...show, oldPassword: !show.oldPassword})}>
                            {show.oldPassword ? <BiShow /> : <BiHide/>}
                            </span>
                        <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type={show.oldPassword ? "text" : 'password'} placeholder="old password" value={oldPassword} onChange={(e)=>handleOnPasswordChange(e)} name='oldPassword'
                        />
                        </div>
                        {error.oldPassword && <div className='text-red-700 font-normal mt-2 text-sm'>{error.oldPassword}</div>}
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <div className='relative flex items-center'>
                        <span className="absolute right-3 flex text-gray-500 cursor-pointer" onClick={()=>setShow({...show, newPassword: !show.newPassword})}>
                            {show.newPassword ? <BiShow /> : <BiHide/>}
                            </span>
                        <input
                            className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type={show.newPassword ? "text" : 'password'} placeholder="new password" name='newPassword' value={newPassword} onChange={(e)=>handleOnPasswordChange(e)}
                        />
                        </div>
                        {error.newPassword && <div className='text-red-700 font-normal mt-2 text-sm'>{error.newPassword}</div>}
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Repeat Password</label>
                        <div className='relative flex items-center'>
                        <span className="absolute right-3 flex text-gray-500 cursor-pointer" onClick={()=>setShow({...show, repeatPassword: !show.repeatPassword})}>
                            {show.repeatPassword ? <BiShow /> : <BiHide/>}
                            </span>
                        <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type={show.repeatPassword ? "text" : 'password'} placeholder="repeat password" name='repeatPassword' value={repeatPassword} onChange={handleOnPasswordChange}
                        />
                        </div>
                        {error.repeatPassword && <div className='text-red-700 font-normal mt-2 text-sm'>{error.repeatPassword}</div>}
                    </div>
                    <div className="mt-4 w-full"> <label className="block text-gray-700 text-sm font-bold mb-2 hover:underline cursor-pointer hover:text-[#234e70]" onClick={()=>navigate('/forget-password')}>Forget Password ?</label></div>
                    <div className="mt-4 w-full flex gap-10">
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded bg-white hover:bg-[#234e70]"
                            type="button" onClick={updatePassword}>
                            Update Password
                        </button>
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded hover:bg-[#234e70] bg-white "
                            type="button" onClick={()=>{setPasswordReset(changePasswordObject);
                            setShow({oldPassword: false, newPassword: false, repeatPassword: false});
                            setError(changePasswordObject)}}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ChangePassword;
