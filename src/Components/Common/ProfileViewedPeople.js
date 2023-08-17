import React, {useEffect} from "react";
import {getIcon, getStatus, handleManageRequest} from "../../Helper";
import {useDispatch, useSelector} from "react-redux";
import {removeFollower, sendRequest, updateRequest} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {useNavigate} from "react-router";

const url = process.env.REACT_APP_API_URL;
const ProfileViewedPeople = () =>{
    const profileViewers = useSelector(state => state.userData.profileViewers);
    const requests = useSelector(state => state.requestData.requests);
    const userData = getLocalStorageData('user');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return(
        <div className="container mx-auto flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-1 2xl:row-span-2 pt-4">
            <div className="relative flex flex-col shadow-lg shadow-gray-400 min-w-0 break-words bg-white w-full mb-6 rounded-lg ">
                <div className="px-1 ">
                    <div className="relative ">
                        <div
                            className="relative m-auto text-black-500 grid-cols-3 ">
                            <div className="m-auto ">
                                <div className="rounded-xl bg-white ">
                                    <div className="p-4 border-b font-bold">
                                        <h3>People Viewed Profile</h3>
                                    </div>
                                    <div>
                                        {profileViewers && profileViewers?.length ? profileViewers.map((ele,index)=>{
                                            let status = getStatus(ele?.author_info[0],requests,userData,'Followings',true);
                                            return (
                                                <div className="m-auto text-gray-600 " key={index}>
                                                    <div
                                                        className="bg-white justify-between">
                                                        <div className={`flex items-center justify-between px-4 py-2  gap-2 lg:gap-1 ${index !== profileViewers.length - 1? 'border-b-[1px]':''}`}>
                                                            <div className='flex cursor-pointer' data-testid={`profile${index}`} onClick={()=> navigate(`/profile/${ele?.author_info[0]?._id}`)}>
                                                                <img className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                     src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url :`${url}${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
                                                                     alt="avatar"/>
                                                                <div className="flex items-center justify-between">
                                                                    <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">{ele?.author_info[0]?.name}</h2>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-2xl cursor-pointer" data-testid={`requests${index}`} onClick={(e)=> handleManageRequest(e,status,ele?.author_info[0],dispatch,requests)}>
                                                                {getIcon(status)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}) :''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfileViewedPeople;
