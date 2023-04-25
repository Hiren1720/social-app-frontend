import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getRequests,
    removeFollower,
    sendRequest,
    setRequest,
    updateRequest
} from "../../Actions/requestActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import Slider from "react-slick";
import {getAllUsers, getProfile} from "../../Actions/userActions";
import {useNavigate} from "react-router";
import useWidthHeight from "../../Hooks/useWidthHeight";
import { FaArrowRight,FaArrowLeft} from "react-icons/fa";
import {url} from '../../Helper/constants';


const UserSlider = ({data,title}) => {
    const dispatch = useDispatch();
    const requestResult = useSelector(state => state.requestData.requestResult);
    const requests = useSelector(state => state.requestData.requests);
    const userData = useSelector(state => state.userData.loggedInUser);
    const navigate = useNavigate();
    const {width} = useWidthHeight();
    let userToken = getTokenObject();
    useEffect(()=>{
        if(requestResult && requestResult?.success){
            dispatch(getAllUsers());
            dispatch(getProfile({id: userToken?._id,isLoggedInUser:true}));
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    },[requestResult]);
    let isOne = width < 780;
    let isTwo = width < 1080;
    const settings = {
        dots: false,
        infinite: false,
        autoplay: false,
        speed: 1000,
        slidesToShow: isOne ? 1 : isTwo ? 2 : 3,
        slidesToScroll: 1,
        arrows: true,
        className: 'slides',
        nextArrow: <FaArrowRight />,
        prevArrow: <FaArrowLeft />
    };
    const handleSendRequest = async (e,item,status) => {
        e.stopPropagation();
        if(status === 'Follow'){
            await dispatch(sendRequest({toUserId: item?._id, fromUserId: userToken?._id}));
        }
        else if(status === 'UnFollow'){
            await dispatch(removeFollower({followerId:item?._id,followingId:userToken?._id,status:'UnFollow'}));
        }
        else if(status === 'Remove'){
            await dispatch(removeFollower({followerId:userToken?._id,followingId:item?._id,status: 'Remove'}));
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
        } else if (title === 'Followers' && userData?.followers.includes(_id)) {
            data = 'Remove';
        }else if ((title === 'Followings' || title === 'Users') && userData?.following.includes(_id)) {
            data = 'UnFollow';
        } else {
            data = 'Follow';
        }
        return data;
    }
    const handleProfile = (e,user) => {
        e.stopPropagation();
        navigate(`/profile/${user?._id}`);
    }
    return (
        <>
            <div className='mt-[10px] mx-4'>
                <div className='mx-2 text-[28px] font-bold'>
                    {title}
                </div>
                <div className="w-full py-4 justify-start rounded-b-lg">
                    <Slider {...settings}>
                        {data && data?.length && data?.map((ele,index)=> (
                            <div key={index}>
                                <div className="flex p-4 border-[2px] mx-2 h-[150px] justify-between rounded-[10px] cursor-pointer hover:bg-grey-900" onClick={(e)=> handleProfile(e,ele)}>
                                    <div className='flex items-center '>
                                        <div className="">
                                            <img className="h-[70px] w-[70px] rounded-full"
                                                 src={ele?.profile_url? `${url}/${ele?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                 alt=""/>
                                        </div>
                                        <div className="ml-4">
                                            <div
                                                className="w-full relative text-gray-600 focus-within:text-gray-400">
                                                <div className='font-semibold max-[480px]:text-[14px]'>
                                                    {ele?.name}
                                                </div>
                                                <div className='text-gray-500 max-[480px]:text-[14px]'>
                                                    {ele?.userName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button onClick={(e) => handleSendRequest(e, ele,getRequestStatus(ele))}
                                                className={`appearance-none max-[480px]:text-[14px] block w-75 text-blue-700 rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                                id="grid-last-name" type="button">{getRequestStatus(ele)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </>
    )
};

export default UserSlider;