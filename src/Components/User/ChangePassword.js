import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {resetPassword} from "../../Actions/userActions";



const ChangePassword = ()=>{
    const dispatch = useDispatch();
    const [passwordReset,setPasswordReset] = useState({oldPassword:'',newPassword:'',repeatPassword:''});
    const handleOnPasswordChange = useCallback((e) => {
        let {name,value} = e.target;
        setPasswordReset({...passwordReset,[name]:value});
    },[passwordReset]);
    const updatePassword = () => {
        dispatch(resetPassword({...passwordReset,type:'update-password'}))
    };
    const {oldPassword,newPassword,repeatPassword} = passwordReset;
    return(
        <div className="px-3 flex items-center bg-grey-light cursor-pointer">
            <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div className="relative  items-bottom justify-between">
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                        <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="text" placeholder="old password" value={oldPassword} onChange={(e)=>handleOnPasswordChange(e)} name='oldPassword'
                        />
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                        <input
                            className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="text" placeholder="new password" name='newPassword' value={newPassword} onChange={(e)=>handleOnPasswordChange(e)}
                        />
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Repeat Password</label>
                        <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="text" placeholder="repeat password" name='repeatPassword' value={repeatPassword} onChange={handleOnPasswordChange}
                        />
                    </div>
                    <div className="mt-4 w-full"> <label className="block text-gray-700 text-sm font-bold mb-2 hover:underline cursor-pointer hover:text-[#234e70]">Forget Password ?</label></div>
                    <div className="mt-4 w-full flex gap-10">
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded bg-white hover:bg-[#234e70]"
                            type="button" onClick={updatePassword}>
                            Update Password
                        </button>
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded hover:bg-[#234e70] bg-white "
                            type="button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ChangePassword;