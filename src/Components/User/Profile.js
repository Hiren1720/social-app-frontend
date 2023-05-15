import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProfile, getProfileViewers} from "../../Actions/userActions";
import {Link, useParams} from "react-router-dom";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import PersonalDetail from "./PersonalDetail";
import Followers from "./Followers";
import {BsFillPlusSquareFill, BsGoogle, BsFacebook, BsTwitter, BsPinterest} from "react-icons/bs";
import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import {FaUserCheck} from 'react-icons/fa';
import {RiUserUnfollowFill} from 'react-icons/ri';
import {
    getFollowers,
    getRequests,
    removeFollower,
    sendRequest,
    setRequest,
    updateRequest
} from "../../Actions/requestActions";
import './User.css';
import Loader from "../Layouts/Loader";
import ButtonLoader from "../ButtonLoader";
import {url} from '../../Helper/constants';
import Posts from '../Posts/Posts';
import useWidthHeight from "../../Hooks/useWidthHeight";
import {useNavigate} from "react-router";
const Profile = ({socket}) => {
    const [user, setUser] = useState({});
    const {id} = useParams();
    const userData = getLocalStorageData('user');
    const dispatch = useDispatch();
    const profile = useSelector(state => state.userData.profile);
    const profileViewers = useSelector(state => state.userData.profileViewers);
    const loading = useSelector(state => state.userData.loading);
    const buttonLoading = useSelector(state => state.requestData.buttonLoading);
    const requests = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const [active, setActive] = useState('Profile');
    const tabs = ['Profile', 'Followers', 'Followings','Posts'];
    const {width} = useWidthHeight();
    const navigate = useNavigate();
    useEffect(()=>{
        if(requestResult && requestResult?.success){
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: userData?._id,isLoggedInUser:true}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    },[requestResult]);
    useEffect(() => {
        if (id) {
            dispatch(getProfile({id: id}));
            dispatch(getProfile({id: userData?._id,isLoggedInUser:true}));
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getFollowers({state: 'followers', id: id}));
            dispatch(getFollowers({state: 'followings', id: id}));
            if(id === userData?._id){
                dispatch(getProfileViewers());
            }
        }
        // eslint-disable-next-line
    }, [id]);
    useEffect(() => {
        if (profile) {
            setUser({...profile});
        }
        // eslint-disable-next-line
    }, [profile]);
    const renderUserDetails = () => {
        switch (active) {
            case 'Followings':
                return <Followers user={user} type={'followings'} setActive={setActive}/>;
            case 'Followers':
                return <Followers user={user} type={'followers'} setActive={setActive}/>;
            case 'Posts':
                return <Posts socket={socket} />;
            case 'Profile':
            default:
                return <PersonalDetail user={user}/>;
        }
    }
    const socialLink = [{link:`http://www.google.com/${user.name}`, icon:<BsGoogle/>}, {link:`http://www.facebook.com/${user.name}`, icon:<BsFacebook/>}, {link:`http://www.twitter.com/${user.name}`, icon:<BsTwitter/>}, {link:`http://www.pinterest.com/${user.name}`, icon:<BsPinterest/>}]
    const handleButton = (e, item, status) => {
        if (userData?._id === id) {
            navigate('/edit-profile', {state:item});
            e.stopPropagation();
        } else if (status === 'Follow') {
            dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
        }else if(status === 'UnFollow'){
            dispatch(removeFollower({followerId:userData?._id,followingId:item?._id,status:'UnFollow'}));
        } else if (status === 'Requested') {
            let req = requests && requests.data && requests.data.filter(ele => ele?.fromUserId === userData?._id).find((ele) => ele?.toUserId === item?._id);
            if (req) {
                dispatch(updateRequest({id: req?._id, status: status}));
            }
        }
    }

    const getRequestStatus = ({_id},isViewer) => {
        let status = requests && requests.data && requests.data.find((ele) => ele?.toUserId === _id)?.status;
        let data = isViewer ? <BsFillPlusSquareFill/> : 'Follow';
        if (status === 'pending') {
            data = isViewer ? <FaUserCheck/>:'Requested';
        }
        else if(userData && userData?.following.includes(_id)){
            data = isViewer ? <RiUserUnfollowFill/>:'UnFollow'
        }
        return data;
    }
    return (
        <>
            {loading ? <Loader/> :
                <>
                    {(user) ? <><main className="profile-page bg-[#eef0f3]">
                        <div>
                            <div className="absolute top-0 w-full h-80 bg-[url('https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Munnar_destjulimg_2_l_770_1154.jpg')] bg-no-repeat object-contain bg-cover bg-center ">
                                <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                            </div>
                            <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px">
                                <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg"
                                     preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                                    <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
                                </svg>
                            </div>
                        </div>
                        <div className="mx-[20px]  2xl:mx-[208px] flex  max-[380px]:mx-[0px] max-[380px]:px-[10px]">
                            <div className="relative py-[8rem] bg-blueGray-200 flex-col w-full lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:row-span-2 ">
                                <div className="container mx-auto pt-96">
                                    <div className="relative flex  min-w-0 break-words bg-white w-full mb-6 shadow-lg shadow-gray-400  rounded-lg -mt-64 ">
                                        <div className="px-1">
                                            <div className="flex flex-wrap justify-center">
                                                <div className="w-full px-4 lg:order-1 flex justify-center">
                                                    <div className="relative w-full h-20 flex justify-center">
                                                        <img
                                                            className="shadow-xl bg-[white] p-[5px] object-cover
                                                    transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 rounded-full align-middle border-none absolute -m-20 -ml-20 lg:-ml-16 max-w-150-px w-40 h-40"
                                                            src={user?.profile_url ? user?.profile_url.includes('https')? user?.profile_url:`${url}/${user?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                            alt=""/>
                                                    </div>
                                                </div>
                                                <div className="w-full px-4 lg:order-3 lg:text-right lg:self-center">
                                                    <div className="py-1 px-3 sm:mt-0"/>
                                                    <div className="flex justify-around font-sans">
                                                        <div className='flex flex-col-reverse'>
                                                            <span className="text-xl font-bold block uppercase py-2 tracking-wide text-blueGray-600 text-center">{user?.followers?.length}</span>
                                                            <div  className="">Followers</div>
                                                        </div>
                                                        <div className='flex flex-col-reverse'>
                                                            <span className="text-xl font-bold block uppercase py-2 tracking-wide text-blueGray-600 text-center">{user?.following?.length}</span>
                                                            <div  className="">Following</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative bg-gradient-to-br from-sky-50 to-gray-200">
                                                <div
                                                    className="relative  m-auto  text-gray-500">
                                                    <div className="m-auto ">
                                                        <div className="bg-white border-b">
                                                            <div className="p-4">
                                                                <div className="grid space-y-4">
                                                                    {socialLink.map((link)=>{
                                                                        return(<>
                                                                            <div
                                                                                className="relative flex items-center space-x-4 pt-2  border-t justify-start  ">
                                                                                <a href={link} className='flex items-center text-blue-400 gap-2 pt-2'>
                                                                                    <span>{link.icon}</span>
                                                                                    <span
                                                                                        className="block w-max  tracking-wide  md:text-sm text-sm transition duration-300 group-hover:text-blue-600">
                                                                                        {(width < 1343 && width >1023 || width < 1744 && width >1530) && link.link.length > 30 ? link.link.slice(0, width < 1188 && width >1024 ?  15:28)+'...' :link.link}</span>
                                                                                </a>
                                                                            </div>
                                                                        </>)
                                                                    })}
                                                                </div>
                                                                <div
                                                                    className="mt-24 space-y-4 text-gray-600 text-center ">
                                                                    <p className="text-xs">By proceeding, you agree to
                                                                        our <a href=""
                                                                               className="underline">Disclaimer</a> and
                                                                        confirm you have read our <a href=""
                                                                                                     className="underline">Privacy
                                                                            and Cookie Statement</a>.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container mx-auto col-span-1 lg:col-span-2 sm:col-span-5 max-[490px]:col-span-5 h-96 lg:pt-[8rem]">
                                    <div className="bg-white">
                                        <div className="border py-3 shadow-lg ">
                                            <div className=" flex items-center justify-between">
                                                <div className="flex py-1 ">
                                                    <div className='flex mt-[5px] max-[610px]:mt-[20px] max-[460px]:px-0  justify-start'>
                                                        {tabs.map((tab, index) => (
                                                            <div key={index} onClick={() => setActive(tab)}
                                                                 className={`mx-5 max-[420px]:mx-2 font-semibold pb-[11px] cursor-pointer hover:border-indigo-300 ${active === tab ? 'border-b-4 border-indigo-300' : ''}`}>{tab}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-xl font-bold py-4'>{user?.userName}</div>
                                    <div className="flex pt-[4px] w-full">
                                        <div className="flex gap-5 w-full mb-[10px] ">
                                            <div>
                                                <span className='text-lg text-[#686868] font-semibold '>Graphic Designer at Self Employed</span>
                                            </div>
                                            <div className='flex'>
                                                <ul className='flex pt-2'>
                                                    <li><AiFillStar/></li>
                                                    <li><AiFillStar/></li>
                                                    <li><AiFillStar/></li>
                                                    <li><AiFillStar/></li>
                                                    <li><AiOutlineStar/></li>
                                                </ul>
                                                <a href="#" title="" className='max-[600px]:hidden float-left text-[#51a5fb] text-base font-bold ml-[20px] underline'>{user?.status ? "Active": "Inactive"}</a>
                                            </div>
                                            <div className='flex h-[60px]  max-[610px]:justify-center max-[640px]:justify-end sm:justify-end md:justify-end '>
                                                <div className='mx-4 max-[400px]:mx-2'>
                                                    <button onClick={(e) => handleButton(e, user, getRequestStatus(user,false))}
                                                            className='bg-white border-[3px] border-grey rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>{buttonLoading ? <ButtonLoader/> : userData?._id === id ? "Edit Profile" : getRequestStatus(user)}
                                                    </button>
                                                </div>
                                                <div className='mx-4 max-[400px]:mx-2 hidden'>
                                                    <button
                                                        className='bg-white border-[3px] border-gray rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>Call
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {renderUserDetails()}
                                </div>
                                <div>
                                    <div className="container mx-auto pt-96 lg:visible max-[1024px]:hidden ">
                                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg shadow-gray-400 rounded-lg -mt-64 ">
                                            <div className="px-1 ">
                                                <div className="relative bg-gradient-to-br from-sky-50 to-gray-200 ">
                                                    <div
                                                        className="relative  m-auto  text-gray-500">
                                                        <div className="m-auto border-t ">
                                                            <div className="bg-white">
                                                                <div className="p-4">
                                                                    <div className="space-y-4">
                                                                        <h2 className="text-2xl text-cyan-900 font-bold border-b">Portfolio</h2>
                                                                    </div>
                                                                    <div className="mt-8 grid space-y-4">
                                                                        <div className="grid grid-cols-6 col-span-2 gap-2">
                                                                            <div
                                                                                className="overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                                                                                <img className="h-full w-full object-cover "
                                                                                     src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div
                                                                                className="overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                                                                                <img className="h-full w-full object-cover  "
                                                                                     src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                                                <img className="h-full w-full object-cover "
                                                                                     src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                                                <img className="h-full w-full object-cover"
                                                                                     src="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                                                                     alt=""/>
                                                                            </div>
                                                                            <div
                                                                                className="relative overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                                                <div
                                                                                    className="text-white text-xl absolute inset-0  bg-slate-900/80 flex justify-center items-center">
                                                                                    + 23
                                                                                </div>
                                                                                <img className="h-full w-full object-cover"
                                                                                     src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
                                                                                     alt=""/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="mt-10 space-y-4 text-gray-600 text-center ">
                                                                        <p className="text-xs">By proceeding, you agree to
                                                                            our <a href=""
                                                                                   className="underline">Disclaimer</a> and
                                                                            confirm you have read our <a href=""
                                                                                                         className="underline">Privacy
                                                                                and Cookie Statement</a>.</p>
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
                                <div className={`${id === userData?._id ?'':'hidden' } mx-0 lg:visible max-[1024px]:hidden`}>
                                    <div className="container mx-auto lg:pt-16 flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-1 2xl:row-span-2">
                                        <div className="relative flex flex-col shadow-lg shadow-gray-400 min-w-0 break-words bg-white w-full mb-6 shadow rounded-lg -mt-24 max-[400px]:-mt-16 ">
                                            <div className="px-1 ">
                                                <div className="relative bg-gradient-to-br from-sky-50 to-gray-200 ">
                                                    <div
                                                        className="relative m-auto text-black-500 grid-cols-3 ">
                                                        <div className="m-auto ">
                                                            <div className="rounded-xl bg-white ">
                                                                <div className="p-4 border-b font-bold">
                                                                    <h3>People Viewed Profile</h3>
                                                                </div>
                                                                <div>
                                                                    {profileViewers && profileViewers?.length ? profileViewers.map((ele,index)=>(
                                                                        <div className="m-auto text-gray-600 " key={index}>
                                                                            <div
                                                                                className="bg-white justify-between">
                                                                                <div className="flex items-center justify-between px-4 py-6  gap-2 lg:gap-1">
                                                                                    <div className='flex'>
                                                                                        <img className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                             src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url :`${url}${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
                                                                                             alt="avatar"/>
                                                                                        <div className="flex items-center justify-between">
                                                                                            <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">{ele?.author_info[0]?.name}</h2>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center hidden text-2xl">
                                                                                        {getRequestStatus(ele?.author_info[0],true)}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )) :''}
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

                    </main>
                    </>:<></>}
                </>
            }
        </>
    )
}
export default Profile;
