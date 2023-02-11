import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {registerUser, setUserData} from "../../Actions/userActions";

const Registration = () => {
    const dispatch = useDispatch();
    const user = useSelector( state => state.userData.user);
    const userResult = useSelector( state => state.userData.userResult);
    const navigate = useNavigate()

    useEffect(()=>{
        if(userResult && userResult.success){
            navigate('/login');
            dispatch(setUserData('userResult',null))
        }
        // eslint-disable-next-line
    },[userResult])
    const handleChange = (e) => {
        let {name,value,checked} = e.target
        if(name === 'hobby'){
            if(checked && !user.hobby.includes(value)){
                user.hobby.push(value)
                dispatch(setUserData('user',{...user}))
            }
            else {
                let index = user.hobby.indexOf(value)
                user.hobby.splice(index,1)
                dispatch(setUserData('user',{...user}))
            }
        }
        else{
            dispatch(setUserData('user',{...user,[name]: value}))
        }
    }
    const handleCreate = async (e) => {
        dispatch(registerUser(user))
    }
    let {name,email,contact,gender,hobby,password,userName,birthDate,state} = user;
    return (
        <>
            <div className='flex justify-evenly items-center rounded-[5px] flex-col p-8'>
                <div className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-first-name">
                                Name
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                   id="grid-first-name" type="text" name='name' value={name} onChange={(e)=> handleChange(e)} placeholder="Name"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-user-name">
                                User Name
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                   id="grid-user-name" type="text" name='userName' value={userName} onChange={(e)=> handleChange(e)} placeholder="User Name"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-email">
                                Email
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-email" name='email' value={email} onChange={(e)=> handleChange(e)}  type="text" placeholder="Email"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Password
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-password" name='password' value={password} onChange={(e)=> handleChange(e)}  type="password" placeholder="Password"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Contact
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-password" name='contact' type="number" value={contact} onChange={(e)=> handleChange(e)} placeholder="Contact"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-date">
                                Birth Date
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-date" name='birthDate' type="datetime-local" value={birthDate} onChange={(e)=> handleChange(e)} placeholder="Birth Date"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-state">
                                State
                            </label>
                            <div className="relative">
                                <select name='state' value={state} onChange={(e)=> handleChange(e)}
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state">
                                    <option value=''>Select State</option>
                                    <option value='Gujarat'>Gujarat</option>
                                    <option value='Maharashtra'>Maharashtra</option>
                                    <option value='Rajasthan'>Rajasthan</option>
                                    <option value='Delhi'>Delhi</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col mt-9 mb-4">
                        <div className='w-full mb-2'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold "
                                   htmlFor="grid-state">
                                Gender
                            </label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input id="bordered-radio-1" type="radio" value="Male" name="gender" checked={gender === 'Male'} onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-radio-1"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input id="bordered-radio-2" type="radio" value="Female"  name="gender" checked={gender === 'Female'} onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-radio-2"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input id="bordered-radio-3" type="radio" value="Other"  name="gender" checked={gender === 'Other'} onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-radio-3"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Other</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col mt-9 mb-4">
                        <div className='w-full mb-2'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold "
                                   htmlFor="grid-state">
                                Hobby
                            </label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input id="bordered-checkbox-1" type="checkbox" value="Programming" name="hobby" checked={hobby.includes('Programming')} onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-checkbox-1"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Programming</label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input checked={hobby.includes('Reading')} id="bordered-checkbox-2" type="checkbox" value="Reading" name="hobby" onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-checkbox-2"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Reading</label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input checked={hobby.includes('Gaming')} id="bordered-checkbox-3" type="checkbox" value="Gaming" name="hobby" onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-checkbox-3"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Gaming</label>
                        </div>
                        <div className="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                            <input checked={hobby.includes('Riding')} id="bordered-checkbox-4" type="checkbox" value="Riding" name="hobby" onChange={(e)=> handleChange(e)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="bordered-checkbox-4"
                                   className="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Riding</label>
                        </div>

                    </div>
                    <div onClick={(e)=> {handleCreate(e)}} className='w-[100%] text-center pt-[0.5rem] pr-[1rem] pb-[0.5rem] pl-[1rem] mb-2 border-none bg-[#ffac41] rounded-[5px] text-[black] cursor-pointer'>
                        <button>Submit</button>
                    </div>
                    <div onClick={(e)=> {navigate('/login')}} className='w-[100%] text-center pt-[0.5rem] pr-[1rem] pb-[0.5rem] pl-[1rem] mb-2 border border-[red] rounded-[5px] text-[black] cursor-pointer'>
                        <button>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Registration;