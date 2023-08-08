import React, {useEffect, useState} from "react";
import {deleteAccount, logout, resetUserResult} from "../../Actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {getLocalStorageData, setLocalStorageData} from "../../Helper/TokenHandler";
import {useNavigate} from "react-router-dom";
const DeActivateAccount = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const userToken = getLocalStorageData('user');
    const deleteAccountResult = useSelector((state) => state.userData.deleteAccountResult);
    const [error, setError] = useState({email:'',password:'',description:''})
    const [deactivateAccount, setDeactivateAccount] = useState({description: '', email: '', password: ''});
    const handleOnChange = (e) => {
        setDeactivateAccount({...deactivateAccount, [e.target.name]: e.target.value})
    };
    useEffect(()=>{
        if(deleteAccountResult?.success){
            let users = getLocalStorageData('users');
            let user = users?.length ? users.find(ele => ele?._id === deleteAccountResult?.data?._id) : null;
            if(user){
                users = users.map(ele => {
                    if(ele?._id === user?._id){
                        ele = deleteAccountResult?.data;
                    }
                    return {...ele}
                })
            }
            setLocalStorageData('users',users);
            dispatch(logout())
            dispatch(resetUserResult())
            navigate('/login')
        }
    },[deleteAccountResult]);
    const handleSubmit = (e) => {
        const {description , email , password } = deactivateAccount;
        let msg = "field is required";
        const errors = {};
        if (!description) errors.description = 'Description'+' ' +msg;
        if (!email) errors.email =  'Email'+' ' +msg;
        if (!password) errors.password =  'Password'+' ' +msg;
        if (Object.keys(errors).length === 0) {
            if (userToken?.email === email) {
                dispatch(deleteAccount({...deactivateAccount,type:'deactivate-account'}));
                setDeactivateAccount({ description: '', email: '', password: '' });
            } else {
                errors.email = 'Invalid email address';
            }
        }
        setError(errors);
    };
    const {description , email , password } = deactivateAccount;
    return (<>
        <div className="px-3 flex items-center bg-grey-light cursor-pointer">
            <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div className="relative  items-bottom justify-between">
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="text" placeholder="Email" name='email' value={email} onChange={(e) => handleOnChange(e)} required
                        />
                        {error.email && <div className='text-red-700 font-normal mt-2 text-sm'>{error.email}</div>}
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="text" placeholder="password" name='password' value={password} onChange={(e) => handleOnChange(e)} required
                        />
                        {error.password && <div className='text-red-700 font-normal mt-2 text-sm'>{error.password}</div>}
                    </div>
                    <div className="mt-4 w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Please Explain Further</label>
                        <textarea
                            className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            name='description' value={description} onChange={(e) => handleOnChange(e)} required>
                        </textarea>
                        {error.description && <div className='text-red-700 font-normal mt-2 text-sm'>{error.description}</div>}
                    </div>
                    <div className="mt-4 w-full flex gap-10">
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded bg-white hover:bg-[#234e70]"
                            type="button" onClick={(e) => handleSubmit(e)} >
                            Save Settings
                        </button>
                        <button
                            className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded hover:bg-[#234e70] bg-white "
                            type="button" onClick={()=>{setError({email:'',description:'', password:''});
                            setDeactivateAccount({email:'',description:'', password:''})}}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default DeActivateAccount;
