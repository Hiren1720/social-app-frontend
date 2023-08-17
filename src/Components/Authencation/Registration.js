import React, {useEffect, useState} from "react";
import {FaCamera} from 'react-icons/fa';
import ButtonLoader from "../ButtonLoader";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {registerUser, setUserData} from "../../Actions/userActions";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
const url = process.env.REACT_APP_API_URL;
const Registration = () => {
    let {t} = useTranslation()
    const dispatch = useDispatch();
    const user = useSelector(state => state.userData.user);
    const userResult = useSelector(state => state.userData.userResult);
    const loading = useSelector(state => state.userData.loading);
    const [image, setImage] = useState('');
    const navigate = useNavigate();
    const pathName = window.location.pathname;
    let userToken = getLocalStorageData('user');

    useEffect(() => {
        if (pathName === '/edit-profile') {
            setImage(userToken?.profile_url.includes('https') ? userToken?.profile_url : `${url}/${userToken?.profile_url}`)
            dispatch(setUserData('user', {...userToken}))
        }
    }, [pathName]);

    useEffect(() => {
        if (userResult && userResult.success) {
            if (pathName === "/edit-profile") {
                navigate(`/profile/${userToken._id}`)
            } else {
                navigate('/login');
            }
        }else if(userResult && !userResult.success){
            toast(userResult?.msg,{type:'error'});
        }
        dispatch(setUserData('userResult',null))
    },[userResult]);

    const handleChange = (e) => {
        const cloudName = 'socialposts';
        const uploadPreset = 'userprofile';
        let {name, value, checked, files} = e.target;
        if (name === 'hobby') {
            if (checked && !user.hobby.includes(value)) {
                user.hobby.push(value);
                dispatch(setUserData('user', {...user}))
            } else {
                let index = user.hobby.indexOf(value);
                user.hobby.splice(index, 1);
                dispatch(setUserData('user', {...user}))
            }
        } else if (name === 'profile') {
            // var url = URL.createObjectURL(files[0]);
            // setImage(url);
            // if (user?.profile_url) {
            //     delete user.profile_url;
            //     dispatch(setUserData('user', {...user, [name]: files[0]}))
            // } else {
                // dispatch(setUserData('user', {...user, [name]: files[0]}))
                const formData = new FormData();
                formData.append('file', files[0]);
                formData.append('upload_preset', uploadPreset);
                const options = {
                    method: 'POST',
                    body: formData,
                };
                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, options)
                    .then(res => res.json())
                    .then(res => {
                        setImage(res.secure_url);
                        dispatch(setUserData('user', {...user, profile_url: res.secure_url}))
                    })
                    // eslint-disable-next-line no-console
                    .catch(err => console.log(err));
            // }
        } else {
            dispatch(setUserData('user', {...user, [name]: value}))
        }
    };
    const handleCreate = (e) => {
        // let formData = new FormData();
        // formData.append('profile', user?.profile || {});
        // formData.append('user', JSON.stringify(user));
        // if (pathName === '/edit-profile') {
        //     dispatch(registerUser({formData:formData, type:'update'}));
        // } else {
        //     dispatch(registerUser({...user, type:'register'}));
        // }
        dispatch(registerUser({...user,type: pathName === '/edit-profile' ? 'update':'register'}));
        setImage('')

    }

    let {name, email, contact, gender, hobby, password, userName, birthDate, state,bio} = user;
    return (
        <>
            <div className="bg-white">
                <div
                    className="font-sans bg-[#eef0f3] shadow-lg w-full min-h-screen flex justify-center lg:flex items-center h-full top-0 backdrop-filter backdrop-blur-lg">
                    <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet"/>
                    <div className=" 2xl:px-36 p-10 bg-white relative justify-center items-center lg:w-full lg: 2xl:mx-40 rounded-3xl filter drop-shadow-2xl
                shadow-gray-200">
                        <div className="flex p-1 sm:mt-4 border-black items-center justify-between">
                            <div className="flex ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400"
                                     viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fill-rule="evenodd"
                                          d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                                          clip-rule="evenodd"/>
                                </svg>
                                <p className="text-gray-600 tracking-wider ml-1 text-sm sm:text-md font-bold">
                                    Hehe
                                </p>
                            </div>
                            <div className={`flex items-center ${pathName === '/edit-profile' ? 'hidden' : ''}`}>
                                <p className="text-gray-600 hidden text-sm lg:block">{t("Have an account?")}</p>
                                <Link to="/login"
                                      className="text-blue-600 ml-1 font-bold hover:underline text-sm sm:text-md">{t("Log in")}</Link>
                            </div>
                        </div>
                        <div className="mt-3  sm:mt-5">
                            <h1 className="text-xl text-gray-600 tracking-wider text-sm sm:text-md font-black">
                                Manage your freelance business with us!
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                Takes less than 10 minutes to fill out all the information needed to register
                                your business
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row'>
                            <div>
                                <div className="flex ">
                                    <div className="flex relative mt-[30px]">
                                        <div>
                                            <img alt=""
                                                 className={`object-cover  rounded-full overflow-hidden  border-[2px] ${image ? 'md:w-[350px] aspect-[3/3] md:h-[350px]' : ''}`}
                                                 src={image ? image : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"}/>
                                        </div>
                                        <div className="relative top-[77%] right-[65px]">
                                            <FaCamera size={40} className="text-gray-400"/>
                                            <input className="absolute top-[0px] opacity-0 w-10" id="grid-profile"
                                                   name='profile' type="file" onChange={(e) => handleChange(e)}
                                                   placeholder={t("Profile")} accept="image/*"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div>
                                    <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 ">
                                        <div>
                                            <label
                                                className="block mb-2 text-sm   text-gray-600 font-bold dark:text-gray-200">{t("Name")}</label>
                                            <input id="grid-first-name" type="text" name='name' value={name}
                                                   onChange={(e) => handleChange(e)} placeholder={t("Name")} data-testid='name'
                                                   className="block w-full px-5 py-3 mt-2 placeholder-gray-400 bg-white border border-gray-200
                           shadow-inner  shadow-gray-400 rounded-full font-bold
                           dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400
                           dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>
                                        </div>

                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600 font-bold dark:text-gray-200">{t("User name")}</label>
                                            <input id="grid-user-name" type="text" name='userName' value={userName} data-testid='user-name'
                                                   onChange={(e) => handleChange(e)} placeholder={t("User Name")}
                                                   className="block w-full px-5 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200 shadow-inner shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>
                                        </div>

                                        {pathName !== '/edit-profile' && <>
                                            <div>
                                                <label
                                                    className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Email address")}</label>
                                                <input id="grid-email" name='email' value={email} data-testid='email'
                                                       onChange={(e) => handleChange(e)} type="text"
                                                       placeholder={t("Email")}
                                                       className="block w-full px-5 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>
                                            </div>

                                            <div>
                                                <label
                                                    className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Password")}</label>
                                                <input id="grid-password" name='password' value={password} data-testid='password'
                                                       onChange={(e) => handleChange(e)} type="password"
                                                       placeholder={t("Password")}
                                                       className="block w-full px-5 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>
                                            </div>
                                        </>}
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Phone number")}</label>
                                            <input id="grid-password" name='contact' type="number" value={contact} data-testid='contact'
                                                   onChange={(e) => handleChange(e)} placeholder={t("Phone number")}
                                                   className="block w-full px-5 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>
                                        </div>
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Birth Date")}</label>
                                            <input id="grid-date" name='birthDate' type="datetime-local" data-testid='birth-date'
                                                   value={birthDate} onChange={(e) => handleChange(e)}
                                                   placeholder={t("Birth Date")}
                                                   className="block w-full px-5 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>

                                        </div>
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600 font-bold dark:text-gray-200">{t("Gender")}</label>
                                            <div className='flex'>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-radio-1" type="radio" value="Male"
                                                           placeholder='Male' name="gender" checked={gender === 'Male'}
                                                           onChange={(e) => handleChange(e)} data-testid='gender-male'
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-radio-1"
                                                           className="py-4 ml-2 w-full text-sm  font-bold text-gray-900 dark:text-gray-300">{t("Male")}</label>
                                                </div>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-radio-2" type="radio" value="Female"
                                                           placeholder='Female' name="gender"  data-testid='gender-female'
                                                           checked={gender === 'Female'}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-radio-2"
                                                           className="py-4 ml-2 w-full text-sm font-bold  text-gray-900 dark:text-gray-300">{t("Female")}</label>
                                                </div>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-radio-3" type="radio" value="Other"
                                                           name="gender" checked={gender === 'Other'}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-radio-3"
                                                           className="py-4 ml-2 w-full text-sm font-bold f text-gray-900 dark:text-gray-300">{t("Other")}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("State")}</label>
                                            <select name='state' value={state} onChange={(e) => handleChange(e)}
                                                    className=" block w-full px-5 py-3 mt-2 font-bold text-gray-700 placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-full dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                                    id="grid-state" placeholder={t("Select State")} data-testid='select-state'>
                                                <option value=''>{t("Select State")}</option>
                                                <option value='Gujarat'>{t("Gujarat")}</option>
                                                <option value='Maharashtra'>{t("Maharashtra")}</option>
                                                <option value='Rajasthan'>{t("Rajasthan")}</option>
                                                <option value='Delhi'>{t("Delhi")}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Hobby")}</label>
                                            <div className='flex flex-col min-[1100px]:flex-row'>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-checkbox-1" type="checkbox"
                                                           placeholder="Programming" value="Programming" name="hobby"
                                                           checked={hobby.includes('Programming')}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-checkbox-1"
                                                           className="py-4 ml-2 w-full text-sm font-bold text-gray-900 dark:text-gray-300">{t("Programming")}</label>
                                                </div>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-checkbox-2" placeholder="Reading"
                                                           type="checkbox" value="Reading" name="hobby"
                                                           checked={hobby.includes('Reading')}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-checkbox-2"
                                                           className="py-4 ml-2 w-full text-sm font-bold text-gray-900 dark:text-gray-300">{t("Reading")}</label>
                                                </div>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-checkbox-3" placeholder="Gaming" type="checkbox"
                                                           value="Gaming" name="hobby"
                                                           checked={hobby.includes('Gaming')}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-checkbox-3"
                                                           className="py-4 ml-2 w-full text-sm font-bold text-gray-900 dark:text-gray-300">{t("Gaming")}</label>
                                                </div>
                                                <div className="flex items-center pl-4 ">
                                                    <input id="bordered-checkbox-4" placeholder="Riding" type="checkbox"
                                                           value="Riding" name="hobby"
                                                           checked={hobby.includes('Riding')}
                                                           onChange={(e) => handleChange(e)}
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                    <label htmlFor="bordered-checkbox-4"
                                                           className="py-4 ml-2 w-full text-sm font-bold text-gray-900 dark:text-gray-300">{t("Riding")}</label>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                        <div>
                                            <label
                                                className="block mb-2 text-sm text-gray-600  font-bold dark:text-gray-200">{t("Bio")}</label>
                                            <textarea id="grid-bio" name='bio' type="text"
                                                      value={bio} onChange={(e) => handleChange(e)}
                                                      placeholder={t("Bio")}
                                                      className="block w-full px-5 mb-4 py-3 mt-2 font-bold placeholder-gray-400 bg-white border border-gray-200  shadow-inner  shadow-gray-400 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"/>

                                        </div>
                                    </div>


                                    <button onClick={(e) => {
                                        handleCreate(e)
                                    }}
                                            className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white
                                              capitalize transition-colors duration-300 transform rounded-md
                                              hover:bg-green-900 bg-green-500
                                              focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        <span>{loading ? <ButtonLoader/> : t('Submit')} </span>

                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100"
                                             viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fill-rule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <button onClick={(e) => {
                                        pathName === "/edit-profile" ? navigate(`/profile/${userToken?._id}`) : navigate('/login')
                                    }}
                                            className="flex items-center justify-between w-full mt-6 px-6 py-3 text-sm
                                               tracking-wide text-white capitalize transition-colors duration-300 transform hover:bg-red-900 bg-red-500
                                                rounded-md  focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        <span>{t("Cancel")} </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Registration;
