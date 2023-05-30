import React from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeFollower, sendRequest, updateRequest} from "../../Actions/requestActions";
const url = process.env.REACT_APP_API_URL;
const UserSlider = ({data, title}) => {
    const dispatch = useDispatch();
    const requests = useSelector(state => state.requestData.requests);
    const userData = useSelector(state => state.userData.loggedInUser);
    const navigate = useNavigate();
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
    const getRequestStatus = ({_id}) => {
        let status = requests && requests.data && requests.data.find((ele) => ele?.fromUserId === userData?._id && ele?.toUserId === _id)?.status;
        let data = 'Follow';
        if (status === 'pending') {
            data = 'Requested';
        } else if (title === 'Followers' && userData?.followers.includes(_id)) {
            data = 'Remove';
        } else if ((title === 'Followings' || title === 'Users') && userData?.following.includes(_id)) {
            data = 'UnFollow';
        } else {
            data = 'Follow';
        }
        return data;
    }
    const handleProfile = (e, user) => {
        e.stopPropagation();
        navigate(`/profile/${user?._id}`);
    }
    return (
        <>
            <div className='mx-4 w-full overflow-y-scroll h-screen scroll-smooth '>
                <div
                    className="w-full py-4 justify-start rounded-b-lg flex-row flex  gap-5 grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                    {data && data?.length > 0 && data?.map((ele, index) => {
                        let status = getRequestStatus(ele);
                        return (
                            <div key={index}>
                                <div
                                    className="relative   max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full shadow-lg rounded-xl  ">
                                    <div className="px-6 pt-8">
                                        <div className="flex flex-wrap justify-center">
                                            <div className="w-full flex justify-center">
                                                <img
                                                    src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}${ele?.profile_url}` : "https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
                                                    className="rounded-full align-middle object-cover border-none absolute mt-2 w-[100px] h-[100px]"/>
                                            </div>
                                            <div className="w-full text-center mt-20">
                                                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                                                    <div className="lg:p-3 p-2 text-center">
                            <span
                                className="text-xl font-bold block uppercase tracking-wide text-slate-700">{ele?.followers?.length}</span>
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
                                            <button onClick={(e) => handleSendRequest(e, ele, status)}
                                                    className={`uppercase mx-auto shadow bg-[#234e70] hover:[#fa6a48] 
                                                        focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 
                                                        rounded ${ele?._id === userData?._id ? 'hidden' : 'block'} 
                                                        ${status === 'UnFollow' ? '' : 'bg-[#fa6a48]'}`}>{status}
                                            </button>
                                            <button
                                                className="block uppercase mx-auto shadow bg-[#fa6a48] hover:bg-[#fa6a48] focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 rounded">Message
                                            </button>
                                        </div>
                                        <div className="mt-4 py-4 border-t border-slate-200 text-center">
                                            <div className="flex flex-wrap justify-center">
                                                <div className="w-full px-4 cursor-pointer" onClick={(e) => handleProfile(e, ele)}>
                                                    View Profile
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )})}

                </div>
            </div>

        </>
    )
};

export default UserSlider;
