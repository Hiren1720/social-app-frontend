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
    } else if ((title === 'Followings' || title === 'Users') && userData?.followings.includes(_id)) {
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

export function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}


const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
export const tobase64Handler = async (files) => {
    const filePathsPromises = [];
    files.forEach(file => {
        filePathsPromises.push(toBase64(file));
    });
    const filePaths = await Promise.all(filePathsPromises);
    return filePaths.map((base64File) => ({selectedFile: base64File}));
}
