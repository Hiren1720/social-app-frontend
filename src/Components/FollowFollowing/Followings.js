import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFollowers} from "../../Actions/requestActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import Table from "../Table";
import Loader from "../Layouts/Loader";


const Followings = () => {
    const dispatch = useDispatch();
    const followings = useSelector(state => state.requestData.followings);
    const loading = useSelector(state => state.requestData.loading);
    const [rowData, setRowData] = useState([]);
    let userToken = getTokenObject();
    const headers = ['id', 'name', 'userName', 'unFollow'];
    const getButton = (id, status, text, color) => {
        return <button
            className={`w-[50px] h-[30px] border-none bg-[${color}] rounded-[5px] text-[white] cursor-pointer`}
            onClick={() => handleRequest(id, status)}>{text}
        </button>
    }
    useEffect(() => {
        dispatch(getFollowers({type: 'user', state: 'followings', id: userToken?.user_id}))
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (followings && followings.data && followings.data.length) {
            let data = followings.data.map((ele, index) => {
                return {
                    ...ele,
                    id: index + 1,
                    unFollow: getButton(ele?._id, 'unFollow', 'UnFollow', 'red'),
                }
            });
            setRowData([...data]);
        } else {
            setRowData([]);
        }
        // eslint-disable-next-line
    }, [followings])
    const handleRequest = () => {
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='flex justify-evenly items-center rounded-[5px] flex-col p-8'>
                    <div className='overflow-x-auto relative"'>
                        <Table headers={headers} rowData={rowData}/>
                    </div>
                </div>}
        </>
    )
};

export default Followings;