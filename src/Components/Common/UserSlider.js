import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeFollower, sendRequest, updateRequest} from "../../Actions/requestActions";
import {blockUser} from "../../Actions/blockUserAction";
import {getProfile} from "../../Actions/userActions";
import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiBlock} from 'react-icons/bi';
import {FaStar} from 'react-icons/fa';
import {ImBlocked} from 'react-icons/im';
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (blockRef.current && !blockRef.current.contains(event.target)) {
                setOpen({show: false, blockId: ''});
            }
        };
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
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
    const handleBlockAccount = (e, item, status) => {
        e.stopPropagation();
        dispatch(blockUser({userId: userData?._id, blockUserId: item?._id, status: status}));
        setOpen({show: false, blockId: null})
    }
    return (
        <>
            <div className='sm:mx-4 overflow-y-scroll h-screen scroll-smooth'>
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

                    <div className="grid-cols-1 sm:grid lg:grid-cols-4 max-[1100px]:!grid-cols-3 max-[800px]:!grid-cols-2">
                        {data?.map((ele, index) => {
                            let status = getStatus(ele, title === 'Followers' ? {} : requests, userData, title, false);
                            return(<div onClick={(e) => handleProfile(e, ele)}
                                        className="mx-3 mt-6 flex flex-col items-center rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 sm:shrink-0 sm:grow sm:basis-0">
                                    <div
                                        className="star-friend  is-active flex justify-end w-full items-center pr-6 pt-6">
                                        {blockUser === "unBlock" ? <ImBlocked className='text-gray-500'/> :<FaStar
                                            className={`${status === 'UnFollow' ? "text-yellow-500" : status === 'Remove' ? 'text-green-500' : 'text-neutral-400'}`}/>}
                                    </div>
                                    <a href="#!">
                                        <img
                                            className="rounded-full w-20 h-20 "
                                            src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}${ele?.profile_url}` : "https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
                                            alt="Los Angeles Skyscrapers"/>
                                    </a>
                                    <div className="px-6 pb-6 pt-2 flex flex-col items-center justify-center w-full ">
                                        <h3 className="text-sm text-black font-bold ">{ele?.name}</h3>
                                        <p className="textFilter-match text-neutral-400">{ele?.userName}</p>
                                        <div
                                            className="friend-stats font-bold flex max-[300px]:flex-col justify-center items-center mt-[20px] max-[300px]:divide-y sm:gap-2">
                                            <div
                                                className="stat-block text-center py-0 px-4 min-[300px]:border-r-[1px] max-[300px]:py-6">
                                                <label className="text-[#999] uppercase text-[0.6rem]">Followers</label>
                                                <div
                                                    className="stat-number text-[#393a4f] font-[600]"> {ele?.followers?.length}</div>
                                            </div>
                                            <div
                                                className="stat-block text-center  py-0 px-4 min-[300px]:border-r-[1px] max-[300px]:py-6">
                                                <label className="text-[#999] uppercase text-[0.6rem]">Posts</label>
                                                <div
                                                    className="stat-number text-[#393a4f] font-[600]">{ele?.posts?.length}</div>
                                            </div>
                                            <div className="stat-block text-center py-0 px-4 max-[300px]:py-6">
                                                <label
                                                    className="text-[#999] uppercase text-[0.6rem]">Followings</label>
                                                <div
                                                    className="stat-number text-[#393a4f] font-[600]">{ele?.followings?.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
