import React from 'react';
import {BsFillPlusSquareFill} from "react-icons/bs";
import {FaUserCheck} from 'react-icons/fa';
import {AiFillMinusSquare} from 'react-icons/ai';
import {removeFollower, sendRequest, updateRequest} from "../Actions/requestActions";
import {getLocalStorageData} from "./TokenHandler";
const userData = getLocalStorageData('user');

export function getStarEmail(email) {
    let result = email.indexOf("@") - 3;
    let middleEmail = email.split('@')[0].slice(3, result);
    let str = '';
    for (let i = 0; i < middleEmail.length; i++) {
        str += '*'
    }
    return email.replace(middleEmail, str);
}

export function generateRandomColor(){
    let letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getStatus = ({_id},requests,userData,title,isOnlyUser) => {
    let status = requests?.data ? isOnlyUser ? requests?.data.find((ele) => ele?.toUserId === _id)?.status : requests?.data.find((ele) => ele?.fromUserId === userData?._id && ele?.toUserId === _id)?.status:'';
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
};

export const getIcon = (status) => {
    switch (status) {
        case "Requested":
            return <FaUserCheck/>;
        case "UnFollow":
            return <AiFillMinusSquare/>;
        case "Follow":
        default:
            return <BsFillPlusSquareFill/>;
    }
};

export const handleManageRequest = (e, status,item,dispatch,requests = null) => {
    if (status === 'Follow') {
        dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
    }else if(status === 'UnFollow'){
        dispatch(removeFollower({followerId:userData?._id,followingId:item?._id,status:'UnFollow'}));
    } else if (status === 'Requested') {
        let req = requests?.data && requests.data.filter(ele => ele?.fromUserId === userData?._id).find((ele) => ele?.toUserId === item?._id);
        if (req) {
            dispatch(updateRequest({id: req?._id, status: status}));
        }
    }
};