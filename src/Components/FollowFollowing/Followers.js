import React, {useEffect} from 'react';
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

    useEffect(() => {
        dispatch(getFollowers({type: 'user', state: 'followers', id: userToken?._id}))
        dispatch(getFollowers({state: 'followings', id: userToken?._id}));
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading ? <Loader/> :
                <div>
                    <UserSlider data={followers?.data} title={'Followers'}/>
                    <UserSlider data={followings?.data} title={'Followings'}/>
                </div>}
        </>
    )
};

export default Followers;
