import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeFollower, sendRequest, updateRequest} from "../../Actions/requestActions";
import {blockUser} from "../../Actions/blockUserAction";
import {getProfile} from "../../Actions/userActions";
import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiBlock} from 'react-icons/bi';
import InfiniteScroll from "react-infinite-scroll-component";
import '../User/User.css'
import {getStatus} from "../../Helper";
import ButtonLoader from "../ButtonLoader";

const url = process.env.REACT_APP_API_URL;
const UserSlider = ({data, receiveUsers, title, total}) => {
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

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (blockRef.current && !blockRef.current.contains(event.target)) {
    //             setOpen({show: false, blockId: ''});
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    //     // eslint-disable-next-line
    // }, []);
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
            <div className='mx-4 w-full overflow-y-scroll h-screen scroll-smooth'>
                {data && data?.length > 0 && <InfiniteScroll
                    dataLength={data?.length}
                    next={receiveUsers}
                    hasMore={data.length !== total}
                    loader={<ButtonLoader/>}
                    endMessage={
                        <div className='flex justify-center my-4'>
                            <b>Yay! You have seen it all</b>
                        </div>
                    }
                >
                    <div
                        className="w-full py-20 min-[750px]:justify-start rounded-b-lg flex-row flex gap-8 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
                        {data?.map((ele, index) => {
                            let blockUser = getBlockUser(ele);
                            let status = getStatus(ele, title === 'Followers' ? {} : requests, userData, title, false);
                            return (<>
                                    <div key={index}
                                        className="flip-card w-full md:h-[365px] h-[340px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center items-center cursor-pointer"
                                        onMouseLeave={() => setOpen({show: false, blockId: ''})}>
                                        <div ref={blockRef}
                                             className={`absolute right-11 z-10 -mt-[14rem] w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${open.show && open.blockId === ele?._id ? '' : 'hidden'}`}
                                             role="menu"
                                             aria-orientation="vertical"
                                             aria-labelledby="user-menu-button"
                                             tabIndex="-1">
                                            <ul className="space-y-2">
                                                <li className='cursor-pointer'>
                                                    <div onClick={(e) =>
                                                        handleBlockAccount(e, ele, blockUser)
                                                    }
                                                         className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <BiBlock/>
                                                        <span className="ml-3">{blockUser}</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="flip-card-inner">
                                            <div className="flip-card-front">
                                                <img className="object-center object-cover h-full w-full"
                                                     src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}${ele?.profile_url}` : "https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
                                                     alt="photo"/>
                                            </div>
                                            <div className=" flex items-center justify-center flip-card-back">

                                                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                                                    {(title === 'Followings' || title === 'Users') && <div
                                                        className={` float-right cursor-pointer mt-6`}
                                                        onClick={() => setOpen({
                                                            show: !open?.show,
                                                            blockId: ele?._id
                                                        })}>
                                                        <BsThreeDotsVertical className="pointer text-black" size={20}/>
                                                    </div>}
                                                    <h1
                                                        className="text-2xl font-semibold text-center text-gray-500 mt-4 mb-4">{ele?.userName}</h1>

                                                    <div className='flex justify-center'><img
                                                        className="object-center object-cover h-28 w-28 rounded-full"
                                                        src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}${ele?.profile_url}` : "https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
                                                        alt="photo"/></div>
                                                    <p className="text-sm text-gray-600 text-justify  mt-2 mb-4">
                                                        <div
                                                            className="mt-2 mb-2 flex gap-14 justify-center flex-row">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p
                                                                    className="text-2xl font-bold text-navy-700 dark:text-white">{ele?.posts?.length}</p>
                                                                <p className="text-sm font-normal text-gray-600">Posts</p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                                    {ele?.followers?.length}
                                                                </p>
                                                                <p className="text-sm font-normal text-gray-600">Followers</p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                                    {ele?.followings?.length}
                                                                </p>
                                                                <p className="text-sm font-normal text-gray-600">Following</p>
                                                            </div>
                                                        </div>
                                                    </p>
                                                    <div className="flex justify-center space-x-4 my-2">
                                                        <button
                                                            className={`bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-md w-1/8  rounded ${ele?._id === userData?._id ? 'hidden' : 'block'} 
                                                        ${status === 'UnFollow' ? '' : 'bg-[#fa6a48]'}`}
                                                            onClick={(e) => {
                                                                blockUser === "unBlock" ? handleBlockAccount(e, ele, blockUser) : handleSendRequest(e, ele, status)
                                                            }}>{blockUser === "unBlock" ? blockUser : status}
                                                        </button>
                                                        <button
                                                            className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-md w-1/8">Message
                                                        </button>
                                                    </div>
                                                    <div className=" border-slate-200 text-black text-center w-full px-4 cursor-pointer pt-2"
                                                         onClick={(e) => handleProfile(e, ele)}>View Profile
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )
                        })}
                    </div>
                </InfiniteScroll>
                }
            </div>

        </>
    )
};

export default UserSlider;
