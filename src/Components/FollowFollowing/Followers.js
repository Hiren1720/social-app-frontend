import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getFollowers,
} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";

const Followers = () => {
    const dispatch = useDispatch();
    const followers = useSelector(state => state.requestData.followers);
    const followings = useSelector(state => state.requestData.followings);
    const loading = useSelector(state => state.requestData.loading);
    let userToken = getLocalStorageData('user');
    const [openModal, setOpenModal] = useState('followers');

    useEffect(() => {
        dispatch(getFollowers({type: 'user', state: 'followers', id: userToken?._id}))
        dispatch(getFollowers({state: 'followings', id: userToken?._id}));
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading ? <Loader/> :
                <div>
                    <div className="relative flex gap-[8px]  shadow-3xl ">
                        <div className='flex flex-col'>
                            <div
                                className="relative shadow-lg h-screen shadow-md shadow-gray-400 rounded-[5px]  p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                <div
                                    className="relative flex w-full h-full justify-center bg-purple-300 bg-cover  bg-no-repeat  bg-cover bg-center">
                                    <div
                                        className="flex h-full w-full items-center justify-center ">
                                        <div className=''>
                                            <h1
                                                className="text-white flex justify-center font-bold text-8xl font-sans animate-bounce">{openModal === 'followers' ? followers?.data?.length : followings?.data?.length}</h1>
                                            <button type="submit"
                                                    className="block text-indigo-800 mt-4 py-2 text-8xl rounded-2xl font-bold mb-2 font-[Lobster] italic font-bold
                                ">{openModal === 'followers' ? 'Followers' : 'Followings'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex  flex-col items-center w-full ">
                            <div className="relative shadow-lg  w-full h-screen shadow-md shadow-gray-400 rounded-[5px]  p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                {openModal === 'followers' ? <UserSlider data={followers?.data} title={'Followers'}/> :
                                    <UserSlider data={followings?.data} title={'Followings'}/>}
                            </div>
                        </div>
                        <div
                            className="relative shadow-lg h-screen top-0 flex bg-white
    flex-col justify-around
    items-center shadow-md shadow-gray-400 gap-5 overflow-hidden bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                            <div>
                                <button onClick={() => {
                                    setOpenModal('followers')
                                }}
                                        className={`relative group w-full  py-2 sm:py-4 px-4 flex flex-row a transform -rotate-90 space-y-2 items-center cursor-pointer rounded-md  hover:smooth-hover ${openModal === 'followers' ? ' bg-purple-300' : ''}`}>

                                    <h4 className="text-black text-2xl font-bold  capitalize text-center">Followers</h4>

                                </button>
                            </div>
                            <div>
                                <button onClick={() => {
                                    setOpenModal('followings')
                                }}
                                        className={`relative group w-full py-2 sm:py-4 px-4 flex  flex-row space-y-2 transform -rotate-90 items-center cursor-pointer rounded-md  hover:smooth-hover ${openModal === 'followings' ? ' bg-purple-300' : ''}`}>

                                    <h4 className="text-black text-2xl font-bold  capitalize text-center">Followings</h4>

                                </button>
                            </div>
                        </div>
                    </div>

                </div>}

        </>
    )
};

export default Followers;
