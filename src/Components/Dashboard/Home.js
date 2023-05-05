import React, {useEffect, useState} from 'react';
import Post from '../Posts/Posts'
import {url} from "../../Helper/constants";
import {useDispatch, useSelector} from "react-redux";
import {BsFillPlusSquareFill} from "react-icons/bs";
import {getFollowers, getRequests, setRequest} from "../../Actions/requestActions";
import {getProfile} from "../../Actions/userActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import '../User/User.css';
import Requests from "../FollowFollowing/Requests";
import Loader from "../Layouts/Loader";
const Home = ({socket}) =>{
    const dispatch = useDispatch();
    const profile = useSelector(state => state.userData.profile);
    const posts = useSelector(state => state.postData.posts);
    const loading = useSelector(state => state.userData.loading);
    const userData = useSelector(state => state.userData.loggedInUser);
    const requests = useSelector(state => state.requestData.userRequests);
    const [postLength , setPostLength] = useState(0);
    let userToken = getLocalStorageData('user');
    useEffect(()=>{
        let loginUserPost = posts?.filter((ele)=>{
            return ele?.createdBy === userToken?._id;
        });
        setPostLength(loginUserPost.length)
    },[postLength, posts])
    useEffect(()=>{
        if(userToken){
            dispatch(getProfile({id: userToken?._id,isLoggedInUser:true}));
            dispatch(getRequests({type:'user'}));
            dispatch(getRequests({type:'allRequest'}));
            dispatch(setRequest());
        }
    }, [profile]);
    return(
        <>
            {loading ? <Loader/> :
                <>
                    {(userData) ? <>
                        <>
                            <div className="bg-[#eef0f3]">
                                <div
                                    className="relative bg-blueGray-200 flex-col lg:grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:row-span-2 ">
                                    <div>
                                        <div
                                            className=" flex-col max-[1024px]:flex items-center  homeProfile fadeInLeft lg:visible max-[1024px]:hidden">
                                            <div
                                                className="relative flex flex-col items-center shadow-lg shadow-md shadow-gray-400 rounded-[5px] mx-auto p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                                <div
                                                    className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
                                                    {/*<img src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png' className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"/>*/}
                                                    <div
                                                        className="bg-pink-400 absolute flex h-32 w-full justify-center rounded-xl bg-cover"></div>
                                                    <div
                                                        className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                                        {/*<img className="h-full w-full rounded-full" src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar11.1060b63041fdffa5f8ef.png' alt="" />*/}
                                                        <img
                                                            className="h-full w-full rounded-full object-cover"
                                                            src={userData?.profile_url ? `${url}/${userData?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                            alt=""/>
                                                    </div>
                                                </div>
                                                <div className="mt-16 flex flex-col items-center">
                                                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                                        {userData?.name}
                                                    </h4>
                                                    <p className="text-base font-normal text-gray-600">{userData?.userName}</p>
                                                </div>
                                                <div
                                                    className="mt-6 mb-3 flex gap-14 md:!gap-14 max-[1200px]:flex-col max-[1024px]:flex-row flex-row">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">{postLength}</p>
                                                        <p className="text-sm font-normal text-gray-600">Posts</p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                            {userData?.followers?.length}
                                                        </p>
                                                        <p className="text-sm font-normal text-gray-600">Followers</p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                            {userData?.following?.length}
                                                        </p>
                                                        <p className="text-sm font-normal text-gray-600">Following</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mx-0 homeProfile fadeInLeft max-[1024px]:hidden visible'>
                                            <div
                                                className="container mx-auto lg:pt-12 flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-1 2xl:row-span-2">
                                                <div
                                                    className="relative flex flex-col shadow-lg shadow-gray-400 min-w-0 break-words bg-white w-full mb-6  rounded-lg -mt-8 max-[400px]:-mt-8 ">
                                                    <div className="px-1 ">
                                                        <div
                                                            className="relative bg-gradient-to-br from-sky-50 to-gray-200 ">
                                                            <div
                                                                className="relative m-auto text-black-500 grid-cols-3 ">
                                                                <div className="m-auto ">
                                                                    <div className="rounded-xl bg-white ">
                                                                        <div className="p-4 border-b font-bold">
                                                                            <h3>Suggestion </h3>
                                                                        </div>
                                                                        <div>
                                                                            <div className="m-auto text-gray-600 ">
                                                                                <div
                                                                                    className="bg-white justify-between">
                                                                                    <div
                                                                                        className="flex items-center justify-between px-4 py-6  gap-2 lg:gap-1">
                                                                                        <div className='flex'>
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                                src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                                                                                alt="avatar"/>
                                                                                            <div
                                                                                                className="flex items-center justify-between">
                                                                                                <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">Brad
                                                                                                    Adams </h2>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/*<div className='flex'>*/}

                                                                                        <div
                                                                                            className="flex items-center  text-2xl">
                                                                                            <BsFillPlusSquareFill/>
                                                                                        </div>
                                                                                        {/*</div>*/}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="m-auto text-gray-600 ">
                                                                                <div
                                                                                    className="bg-white justify-between">
                                                                                    <div
                                                                                        className="flex items-center justify-between px-4 py-6  gap-2 lg:gap-1">
                                                                                        <div className='flex'>
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                                src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                                                                                alt="avatar"/>
                                                                                            <div
                                                                                                className="flex items-center justify-between">
                                                                                                <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">Brad
                                                                                                    Adams </h2>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/*<div className='flex'>*/}

                                                                                        <div
                                                                                            className="flex items-center  text-2xl">
                                                                                            <BsFillPlusSquareFill/>
                                                                                        </div>
                                                                                        {/*</div>*/}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="m-auto text-gray-600 ">
                                                                                <div
                                                                                    className="bg-white justify-between">
                                                                                    <div
                                                                                        className="flex items-center justify-between px-4 py-6  gap-2 lg:gap-1">
                                                                                        <div className='flex'>
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                                src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                                                                                alt="avatar"/>
                                                                                            <div
                                                                                                className="flex items-center justify-between">
                                                                                                <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">Brad
                                                                                                    Adams </h2>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/*<div className='flex'>*/}

                                                                                        <div
                                                                                            className="flex items-center  text-2xl">
                                                                                            <BsFillPlusSquareFill/>
                                                                                        </div>
                                                                                        {/*</div>*/}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-span-1 lg:col-span-2 sm:col-span-5 max-[490px]:col-span-5 h-96 ">
                                        <div className="flex items-center  bg-white justify-center shadow-lg mb-4 ">
                                            <form className="w-full bg-white rounded-lg px-4 pt-2">
                                                <div className='border-2 border-pink-400'></div>
                                                <div className="flex flex-wrap -mx-3 mb-6">
                                                    <div className="w-full  flex md:w-full px-3 mb-2 mt-2">
                                                        <div
                                                            className="flex  items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                                            <img className="rounded-full h-[45px] w-[50px] object-cover"
                                                                 src={userData?.profile_url ? `${url}/${userData?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                 alt=""/>
                                                        </div>
                                                        <div className="relative w-full">
                                                            <input
                                                                className="bg-gray-100 rounded-[40px] shadow-inner  shadow-gray-700 leading-normal resize-none w-full h-15 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                                                id="comment" type="text" placeholder="Say Something"
                                                                name={"comment"}
                                                            ></input>
                                                            <button
                                                                className="text-white absolute w-[20%] rounded-[40px] right-[0.4rem] p-[5px] m-0 bottom-[1.1rem] bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none  font-medium  text-sm "
                                                            >Share
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                        <div className=''>
                                            <Post socket={socket}/>
                                        </div>
                                    </div>
                                    <div>
                                        {requests?.data?.length > 0 && <div
                                            className="bg-blueGray-50 homeProfile fadeInRight max-[1024px]:hidden visible shadow-md">
                                            <div className="w-full">
                                                <div
                                                    className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
                                                    <div className="p-2 ">
                                                        <div className="space-y-4 pb-5">
                                                            <h2 className="text-2xl text-cyan-900 font-bold border-b p-2">Recent
                                                                Notification</h2>
                                                        </div>
                                                        <Requests/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="shadow-xl animate-pulse max-[1024px]:hidden visible">

                                            <div
                                                className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                                <a href="#">
                                                    <img className="rounded-t-lg p-8"
                                                         src="https://image.coolblue.nl/840x473/content/49a851e5fe9a5c48bdfa94364b35f0ab"
                                                         alt="product image"/>
                                                </a>
                                                <div className="px-5 pb-5">
                                                    <a href="#">
                                                        <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">Apple
                                                            Watch Series 7
                                                            GPS, Aluminium Case, Starlight Sport</h3>
                                                    </a>
                                                    <div className="flex items-center mt-2.5 mb-5">
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <span
                                                            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                            <span
                                                className="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
                                                        <a href="#"
                                                           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add
                                                            to cart</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </>
                    </> : <></>}
                </>
            }
            </>
    );
}
export default Home;
