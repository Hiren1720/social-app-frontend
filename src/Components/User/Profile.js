import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProfile} from "../../Actions/userActions";
import {useParams} from "react-router-dom";
import {getTokenObject} from "../../Helper/TokenHandler";
import PersonalDetail from "./PersonalDetail";
import Followers from "./Followers";
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

const Profile = () => {
    const [user, setUser] = useState({});
    const {id} = useParams();
    let userToken = getTokenObject();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.userData.profile);
    const userData = useSelector(state => state.userData.loggedInUser);
    const loading = useSelector(state => state.userData.loading);
    const buttonLoading = useSelector(state => state.requestData.buttonLoading);
    const requests = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const [active, setActive] = useState('Profile');
    const tabs = ['Profile', 'Followers', 'Followings'];
    useEffect(()=>{
        if(requestResult && requestResult?.success){
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: userToken?._id,isLoggedInUser:true}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    },[requestResult]);
    useEffect(() => {
        if (id) {
            dispatch(getProfile({id: id}));
            dispatch(getProfile({id: userToken?._id,isLoggedInUser:true}));
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getFollowers({state: 'followers', id: id}));
            dispatch(getFollowers({state: 'followings', id: id}));
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
            case 'Profile':
            default:
                return <PersonalDetail user={user}/>;
        }
    }
    const handleButton = (e, item, status) => {
        e.stopPropagation();
        if (userToken?._id === id) {

        } else if (status === 'Follow') {
            dispatch(sendRequest({toUserId: item?._id, fromUserId: userToken?._id}));
        }else if(status === 'UnFollow'){
            dispatch(removeFollower({followerId:userToken?._id,followingId:item?._id,status:'UnFollow'}));
        } else if (status === 'Requested') {
            let req = requests && requests.data && requests.data.filter(ele => ele?.fromUserId === userToken?._id).find((ele) => ele?.toUserId === item?._id);
            if (req) {
                dispatch(updateRequest({id: req?._id, status: status}));
            }
        }
    }
    const getRequestStatus = ({_id}) => {
        let status = requests && requests.data && requests.data.find((ele) => ele?.toUserId === _id)?.status;
        let data = 'Follow';
        if (status === 'pending') {
            data = 'Requested';
        }
        else if(userData && userData?.following.includes(_id)){
            data = 'UnFollow'
        }
        return data;
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className="flex justify-center m-4">
                    <div className="w-full">
                        {(user) ? <>
                                <div className="cover-photo w-full h-[200px] rounded-tr-lg rounded-tl-lg"/>
                                <div className="absolute md:top-[200px] max-[1180px]:left-[100px] max-[680px]:left-[60px] max-[768px]:top-[200px] max-[610px]:left-[200px] max-[520px]:left-[180px] max-[480px]:left-[120px] max-[380px]:left-[120px] max-[360px]:left-[100px] justify-center text-center left-[150px] ">
                                    <div className='bg-white rounded-[100px] p-[3px]'><img
                                        className="h-[200px] min-[280px]:h-[150px] min-[280px]:w-[150px] w-[200px] rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""/>
                                    </div>
                                    <div className='font-bold mt-6 text-[24px]'>
                                        {user?.name}
                                    </div>
                                </div>
                                <div className="w-full bg-white border border-r-[2px] border-l-[2px] px-4 pt-4">
                                    <div className='flex h-[60px] md:mt-4 sm:mt-4 max-[640px]:mt-4 max-[610px]:justify-center max-[610px]:mt-[140px]  max-[640px]:justify-end sm:justify-end md:justify-end '>
                                        <div className='mx-4 max-[400px]:mx-2'>
                                            <button onClick={(e) => handleButton(e, user, getRequestStatus(user))}
                                                    className='bg-white border-[3px] border-grey rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>{buttonLoading ? <ButtonLoader/> : userToken?.user_id === id ? "Edit Profile" : getRequestStatus(user)}
                                            </button>
                                        </div>
                                        <div className='mx-4 max-[400px]:mx-2 hidden'>
                                            <button
                                                className='bg-white border-[3px] border-gray rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>Call
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex mt-[80px] max-[610px]:mt-[20px] max-[460px]:px-0 px-5 justify-start'>
                                        {tabs.map((tab, index) => (
                                            <div key={index} onClick={() => setActive(tab)}
                                                 className={`mx-5 max-[420px]:mx-2 font-semibold pb-[11px] cursor-pointer px-2 hover:border-indigo-300 ${active === tab ? 'border-b-4 border-indigo-300' : ''}`}>{tab}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {renderUserDetails()}</> :
                            <></>}
                    </div>
                </div>
            }
        </>
    )
}
export default Profile;