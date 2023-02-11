import React, {useEffect, useState} from 'react';
import Slider from "react-slick";
import {useDispatch, useSelector} from "react-redux";
import { FaArrowRight,FaArrowLeft} from "react-icons/fa";
import {
    getRequests,
    removeFollower,
    sendRequest,
    setRequest,
    updateRequest
} from "../../Actions/requestActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useNavigate} from "react-router-dom";

const Followers = ({user,type,setActive}) => {
    const [followers,setFollowers] = useState([]);
    const data = useSelector(state => state.requestData[type]);
    const requests = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userToken = getTokenObject();
    let userData = userToken?._doc;
    useEffect(()=>{
        if(data && data?.data && data?.data.length){
            setFollowers([...data?.data]);
        }
        else {
            setFollowers([]);
        }
        // eslint-disable-next-line
    },[data]);
    useEffect(()=>{
        if(requestResult && requestResult?.success){
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    },[requestResult])
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <FaArrowRight />,
        prevArrow: <FaArrowLeft />
    };
    const handleSendRequest = async (e,item,status) => {
        e.stopPropagation();
        if(status === 'Follow'){
            await dispatch(sendRequest({toUserId: item?._id, fromUserId: userToken?.user_id}));
        }
        else if(status === 'UnFollow'){
            await dispatch(removeFollower({followerId:item?._id,followingId:userToken?.user_id,status:'UnFollow'}));
        }
        else if(status === 'Remove'){
            await dispatch(removeFollower({followerId:userToken?.user_id,followingId:item?._id,status: 'Remove'}));
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
            <div className="w-full bg-white border px-4 py-4 justify-start rounded-br-lg">
                <Slider {...settings}>
                    {followers && followers.length && followers.map((ele,index)=> (
                        <div key={index}>
                            <div className="flex p-4 border mx-2 h-[120px] justify-between rounded-[10px] cursor-pointer hover:bg-grey-900" onClick={(e)=> handleProfile(e,ele)}>
                                <div className='flex items-center'>
                                    <div className="">
                                        <img className="h-10 w-10 rounded-full"
                                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                             alt=""/>
                                    </div>
                                    <div className="ml-4">
                                        <div
                                            className="w-full mb-6 md:mb-0 relative text-gray-600 focus-within:text-gray-400">
                                            <div className='font-semibold '>
                                                {ele?.name}
                                            </div>
                                            <div className='text-gray-500'>
                                                {ele?.userName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={(e) => handleSendRequest(e, ele,getRequestStatus(ele))}
                                            className={`appearance-none block w-75 text-blue-700 rounded py-2 px-4 leading-tight ${ele?._id === userToken.user_id ? 'hidden':''} ${getRequestStatus(ele) === 'UnFollow' ? '' : 'bg-gray-200 focus:border-gray-400 border border-gray-200'}`}
                                            id="grid-last-name" type="button">{getRequestStatus(ele)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )
};
export default Followers;