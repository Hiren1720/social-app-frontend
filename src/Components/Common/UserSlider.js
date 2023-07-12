import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeFollower, sendRequest, updateRequest} from "../../Actions/requestActions";
import {blockUser} from "../../Actions/blockUserAction";
import {getProfile} from "../../Actions/userActions";
import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiBlock} from 'react-icons/bi';

import {getStatus} from "../../Helper";

const url = process.env.REACT_APP_API_URL;
const UserSlider = ({data, title}) => {
    const dispatch = useDispatch();
    const requests = useSelector(state => state.requestData.requests);
    const userData = useSelector(state => state.userData.loggedInUser);
    const blocked = useSelector(state => state.blockData.blockResult);
    const [open, setOpen] = useState({show: false, blockId: ''});
    const blockRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        if (blocked?.success) {
            dispatch(getProfile({id: userData?._id, isLoggedInUser: true}));
        }
        // eslint-disable-next-line
    }, [blocked]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (blockRef.current && !blockRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
    }, []);
    const handleSendRequest = async (e, item, status) => {
        let request = requests && requests.data && requests.data.find((ele) => ele?.fromUserId === userData?._id && ele?.toUserId === item?._id);
        e.stopPropagation();
        if (status === 'Follow') {
            await dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
        } else if (status === 'UnFollow') {
            await dispatch(removeFollower({followerId: userData?._id, followingId: item?._id, status: 'UnFollow'}));
        } else if (status === 'Remove') {
            await dispatch(removeFollower({followerId: item?._id, followingId: userData?._id, status: 'Remove'}));
        } else if (status === 'Requested') {
            await dispatch(updateRequest({id: request?._id, status: status}));
        }
    }
    const getBlockUser = ({_id}) => {
        let data = 'block';
        if (userData?.blockedUsers?.includes(_id)) {
            data = 'unBlock';
        } else {
            data = 'block';
        }
        return data;
    }
    const handleProfile = (e, user) => {
        e.stopPropagation();
        navigate(`/profile/${user?._id}`);
    }
    const handleBlockAccount = async (e, item, status) => {
        e.stopPropagation();
        dispatch(blockUser({userId: userData?._id, blockUserId: item?._id, status: status}));
        setOpen({show: false, blockId: null})
    }


    return (
        <>
            <div className='mx-4 w-full overflow-y-scroll h-screen scroll-smooth '>
                <div className="w-full py-4 min-[750px]:justify-start  rounded-b-lg flex-row flex  gap-5 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
                    {data && data?.length > 0 && data?.map((ele, index) => {
                        let blockUser = getBlockUser(ele);
                        let status = getStatus(ele, title === 'Followers'? {}: requests, userData, title, false);
                        return (
                            <div key={index} className="px-2">
                                <div
                                    className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full shadow-lg shadow-gray-300 rounded-xl  ">
                                    <div ref={blockRef}
                                        className={`absolute  z-10 mt-8 w-36 left-32 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${open.show && open.blockId === ele?._id ? '' : 'hidden'}`}
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                        tabIndex="-1">
                                        <ul className="space-y-2">
                                            <li className='cursor-pointer'>
                                                <div onClick={(e) => handleBlockAccount(e, ele, blockUser)}
                                                     className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <BiBlock/>
                                                    <span className="ml-3">{blockUser}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="px-6 pt-8">
                                       { (title === 'Followings' || title === 'Users') && <div
                                            className={`flex justify-end cursor-pointer mt-2`}
                                            onClick={() => setOpen({
                                                show: !open?.show,
                                                blockId: ele?._id
                                            })}>
                                            <BsThreeDotsVertical className="pointer" size={20}/>
                                        </div>}
                                        <div className="flex flex-wrap justify-center">
                                            <div className="w-full flex justify-center">
                                                <img
                                                    src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}${ele?.profile_url}` : "https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
                                                    className="rounded-full align-middle object-cover border-none absolute mt-2 w-[100px] h-[100px]" alt='profile'/>
                                            </div>
                                            <div className="w-full text-center mt-20 ">
                                                <div
                                                    className={`flex justify-between lg:pt-4 pt-8 pb-0 ${(title === "Followers" || title === "Followings") ? 'max-[750px]:flex-col max-[640px]:!flex-row' : ''}`}>
                                                    <div
                                                        className="lg:p-3 p-2 text-center max-[750px]:!pr-0 max-[640px]:!pr-8 !pr-8 ">
                            <span
                                className="text-xl font-bold block uppercase tracking-wide text-slate-700">{ele?.posts?.length}</span>
                                                        <span className="text-sm text-slate-400">Post</span>
                                                    </div>
                                                    <div className="lg:p-3 p-2 text-center">
                            <span
                                className="text-xl font-bold block uppercase tracking-wide text-slate-700">{ele?.followers?.length}</span>
                                                        <span className="text-sm text-slate-400">Followers</span>
                                                    </div>

                                                    <div className="lg:p-3 p-2 text-center">
                            <span
                                className="text-xl font-bold block uppercase tracking-wide text-slate-700">{ele?.following?.length}</span>
                                                        <span className="text-sm text-slate-400">Following</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center mt-1">
                                            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">{ele?.userName}</h3>
                                            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                                                <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"/>{ele?.name}
                                            </div>
                                        </div>
                                        <div className='flex gap-5 pt-4'>
                                            <button onClick={(e) => {
                                                blockUser === "unBlock" ? handleBlockAccount(e, ele, blockUser) : handleSendRequest(e, ele, status)
                                            }}
                                                    className={`uppercase mx-auto shadow bg-[#234e70] hover:[#fa6a48] 
                                                        focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 
                                                        rounded ${ele?._id === userData?._id ? 'hidden' : 'block'} 
                                                        ${status === 'UnFollow' ? '' : 'bg-[#fa6a48]'}`}>{blockUser === "unBlock" ? blockUser : status}
                                            </button>
                                            <button
                                                className="block uppercase mx-auto shadow bg-[#fa6a48] hover:bg-[#fa6a48] focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 rounded">Message
                                            </button>
                                        </div>
                                        <div className="mt-4 py-4 border-t border-slate-200 text-center">
                                            <div className="flex flex-wrap justify-center">
                                                <div className="w-full px-4 cursor-pointer"
                                                     onClick={(e) => handleProfile(e, ele)}>
                                                    View Profile
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </>
    )
};

export default UserSlider;
