import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getFollowers, getRequests, setRequest,
} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";
import {getProfile} from "../../Actions/userActions";

const Followers = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.requestData.followFollowing);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const loading = useSelector(state => state.requestData.loading);
    let userToken = getLocalStorageData('user');
    const [active, setActive] = useState('Followers');

    useEffect(() => {
        dispatch(getFollowers({type: active, id: userToken?._id}));
        // eslint-disable-next-line
    }, [active]);
    useEffect(() => {
        dispatch(getProfile({id: userToken?._id, isLoggedInUser: true}));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (requestResult && requestResult?.success) {
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: userToken?._id, isLoggedInUser: true}));
            dispatch(getFollowers({type: active, id: userToken?._id}));
            dispatch(setRequest());
        }
    }, [requestResult]);

    return (
        <>
            {loading ? <Loader/> :
                <div className="relative flex gap-[8px] h-[93vh] ">
                    {/*<div className='flex flex-col block max-[1250px]:hidden'>*/}
                    {/*<div className='  '>*/}
                    {/*<div*/}
                    {/*    className="relative block max-[1250px]:hidden shadow-lg h-full shadow-md shadow-gray-400 rounded-[5px]  p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">*/}
                    {/*    <div*/}
                    {/*        className="relative flex w-full h-full justify-center bg-purple-300 bg-cover  bg-no-repeat  bg-cover bg-center">*/}
                    {/*<div*/}
                    {/*    className="flex h-full w-full items-center justify-center ">*/}
                    {/*    <div className=''>*/}
                    {/*        <h1*/}
                    {/*            className="text-white flex justify-center font-bold text-8xl font-sans animate-bounce">{active === 'followers' ? followers?.data?.length : followings?.data?.length}</h1>*/}
                    {/*        <button type="submit"*/}
                    {/*                className="block text-indigo-800 mt-4 py-2 text-7xl rounded-2xl font-bold mb-2 font-[Lobster] italic font-bold*/}
                    {/*">{active === 'followers' ? 'Followers' : 'Followings'}*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    <div className="flex  flex-col items-center w-full ml-28 max-[1500px]:ml-[0px] ">
                        <div
                            className="relative w-full h-[93vh] overflow-y-scroll rounded-[5px]  p-5   dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                            <UserSlider data={data} title={active}/>
                        </div>
                    </div>
                    <div
                        className="relative shadow-lg h-[93vh] top-0 flex bg-white flex-col justify-around items-center shadow-md shadow-gray-400 gap-5 overflow-hidden bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                        <div>
                            <button onClick={() => {
                                setActive('Followers')
                            }}
                                    className={`relative group w-full  py-2 sm:py-4 px-4 flex flex-row a transform -rotate-90 space-y-2 items-center cursor-pointer rounded-md  hover:smooth-hover ${active === 'Followers' ? ' bg-purple-300' : ''}`}>

                                <h4 className="text-black text-2xl font-bold  capitalize text-center">Followers</h4>

                            </button>
                        </div>
                        <div>
                            <button onClick={() => {
                                setActive('Followings')
                            }}
                                    className={`relative group w-full py-2 sm:py-4 px-4 flex  flex-row space-y-2 transform -rotate-90 items-center cursor-pointer rounded-md  hover:smooth-hover ${active === 'Followings' ? ' bg-purple-300' : ''}`}>
                                <h4 className="text-black text-2xl font-bold  capitalize text-center">Followings</h4>
                            </button>
                        </div>
                    </div>
                </div>}

        </>
    )
};

export default Followers;
