import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getFollowers,
    getRequests,
    removeFollower,
    sendRequest,
    setRequest,
    updateRequest
} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {useNavigate} from "react-router-dom";
import {getProfile} from "../../Actions/userActions";
const url = process.env.REACT_APP_API_URL;
const Followers = ({type,setActive}) => {
    const [followers,setFollowers] = useState([]);
    const data = useSelector(state => state.requestData[type]);
    const requests = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userData = getLocalStorageData('user');
    useEffect(()=>{
        if(data && data?.data && data?.data.length){
            setFollowers([...data?.data]);
        }
        else {
            setFollowers([]);
        }
    },[data]);
    useEffect(()=>{
        if(requestResult && requestResult?.success){
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: userData?._id,isLoggedInUser:true}));
            dispatch(getFollowers({type: 'user', state: 'followers', id: userData?._id}))
            dispatch(getFollowers({state: 'followings', id: userData?._id}));
            dispatch(setRequest());
        }
    },[requestResult]);
    const handleSendRequest = async (e,item,status) => {
        e.stopPropagation();
        if(status === 'Follow'){
            await dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
        }
        else if(status === 'UnFollow'){
            await dispatch(removeFollower({followerId:item?._id,followingId:userData?._id,status:'UnFollow'}));
        }
        else if(status === 'Remove'){
            await dispatch(removeFollower({followerId:userData?._id,followingId:item?._id,status: 'Remove'}));
        }
        else if(status === 'Requested'){
            await dispatch(updateRequest({id:item?._id,status:status}));
        }
    }
    const getRequestStatus = ({_id}) => {
        let status = requests && requests.data && requests.data.find((ele) => ele?.toUserId === _id)?.status;
        let data = 'Follow';
        if (status === 'pending') {
            data = 'Requested';
        } else if (type === 'followers' && userData?.followers.includes(_id)) {
            data = 'Remove';
        }else if (type === 'followings' && userData?.following.includes(_id)) {
            data = 'UnFollow';
        } else {
            data = 'Follow';
        }
        return data;
    }
    const handleProfile = (e,user) => {
        e.stopPropagation();
        navigate(`/profile/${user?._id}`);
        setActive('Profile');
    }
    return (
        <>
            <div className="w-full px-3 py-3 justify-center grid min-[1300px]:grid-cols-2 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1 gap-y-1 gap-x-10 rounded-b-lg  ">
                {followers && followers.length && followers.map((ele,index)=> (
                    <div key={index}>
                        <div
                            className="relative shadow-lg shadow-gray-700 max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16 ">
                            <div className="px-6 pt-8">
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full flex justify-center">
                                        <img
                                            src= {ele?.profile_url ? ele?.profile_url.includes('https')?ele?.profile_url:`${url}/${ele?.profile_url}` :"https://gambolthemes.net/workwise-new/images/resources/pf-icon2.png"}
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
                                        <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>{ele?.name}
                                    </div>
                                </div>
                                <div className='flex gap-5 pt-4'>
                                    <button onClick={(e) => handleSendRequest(e, ele,getRequestStatus(ele))}
                                            className={`block uppercase mx-auto shadow bg-[#234e70] hover:[#fa6a48] focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 rounded ${ele?._id === userData.user_id ? 'hidden':''} ${getRequestStatus(ele) === 'UnFollow' ? '' : 'bg-[#fa6a48]'}`}>{getRequestStatus(ele)}
                                    </button>
                                    <button
                                        className="block uppercase mx-auto shadow bg-[#fa6a48] hover:bg-[#fa6a48] focus:shadow-outline focus:outline-none text-white text-xs py-2 px-3 rounded">Message
                                    </button>
                                </div>
                                <div className="mt-4 py-4 border-t border-slate-200 text-center">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full px-4 cursor-pointer" onClick={(e)=> handleProfile(e,ele)}>
                                            View Profile
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};
export default Followers;
