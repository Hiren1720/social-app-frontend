import React from 'react';
import {BsFillPlusSquareFill} from "react-icons/bs";
import {FaUserCheck} from 'react-icons/fa';
import {AiFillMinusSquare} from 'react-icons/ai';

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
}

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
}