
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getFollowers, getRequests, setRequest,
} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";
import {getProfile} from "../../Actions/userActions";
import '../User/User.css'
const Followers = () => {
    const dispatch = useDispatch();
    const [data,setData] = useState([]);
    const [page,setPage] = useState(0);
    const pageSize = 10;
    const user = useSelector(state => state.requestData.followFollowing);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const loading = useSelector(state => state.requestData.loading);
    const totalUsers = useSelector(state => state.requestData.totalUsers);
    let userToken = getLocalStorageData('user');
    const [active, setActive] = useState('Followers');
    useEffect(()=> {
        if(user?.length){
            setData([...data,...user]);
        }
        else {
            setData([]);
            setPage(0);
        }
    },[user, active]);
    useEffect(() =>{
        setPage(0);
        setData([]);
        receiveUsers(page !==0)
        // eslint-disable-next-line
    }, [active]);
    const receiveUsers = (isFirstPage) => {
             dispatch(getFollowers({page:isFirstPage? 0: page, pageSize, type:active,id: userToken?._id,isLoading:true}));
             setPage(pre => pre + 1);

    };
    useEffect(() => {
        dispatch(getProfile({id: userToken?._id, isLoggedInUser: true}));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (requestResult && requestResult?.success) {
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: userToken?._id, isLoggedInUser: true}));
            dispatch(getFollowers({page: 0, pageSize: 100,type: active, id: userToken?._id,isLoading:true}));
            dispatch(setRequest());
        }
    }, [requestResult]);

    return (
        <>
            {loading ? <Loader/> :
                <div className="">
                    <div >
                        <div >
                            <div
                                className='flex items-center justify-center  from-gray-800 via-greeen-300 to-blue-500 bg-gradient-to-br'>
                                <div className='w-full max-w-[105rem] sm:px-10 px-2 py-8  bg-white rounded-lg shadow-xl'>
                                    <div className='w-full  bg-white'>
                                        <div className="sticky top-16 z-10 p-4 w-full sm:my-[35px] flex justify-around bg-white">
                                            <button type="button" className={`py-2 sm:px-24 h-full sm:text-lg text-md font-bold flex justify-center  cursor-pointer ${active === 'Followers' ? '  rounded-3xl w-[30%] bg-gradient-to-r from-cyan-400 to-cyan-600': ''}`} onClick={() => {
                                                setActive('Followers')
                                                setPage(0);
                                            }}>Followers</button>
                                            <button type="button" className={`py-2 sm:px-24 h-full sm:text-lg text-md font-bold flex justify-center cursor-pointer ${active === 'Followings' ? '  h-full rounded-3xl w-[30%] bg-gradient-to-r from-cyan-400 to-cyan-600': ''}`} onClick={() => {
                                                setActive('Followings');
                                                setPage(0);
                                            }}>Followings</button>
                                        </div>
                                        <div className="py-8 px-4  lg:py-16 lg:px-6">
                                            <div
                                                className="relative w-full h-screen overflow-y-scroll rounded-[5px]  p-5   dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                                <UserSlider data={data} total={totalUsers} receiveUsers={receiveUsers} title={active}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div></div>}
        </>
    )
};

export default Followers;
