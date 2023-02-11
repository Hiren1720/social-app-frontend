import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFollowers} from "../../Actions/requestActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import Table from "../Table";
import Loader from "../Layouts/Loader";


const Followers = () => {
    const dispatch = useDispatch();
    const followers = useSelector(state => state.requestData.followers);
    const loading = useSelector(state => state.requestData.loading);
    const [rowData, setRowData] = useState([]);
    let userToken = getTokenObject();
    const headers = ['id', 'name', 'userName', 'remove'];
    const getButton = (id, status, text, color) => {
        return <button
            className={`w-[50px] h-[30px] border-none bg-[${color}] rounded-[5px] text-[white] cursor-pointer`}
            onClick={() => handleRequest(id, status)}>{text}
        </button>
    }
    useEffect(() => {
        dispatch(getFollowers({type: 'user', state: 'followers', id: userToken?.user_id}))
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (followers && followers.data && followers.data.length) {
            let data = followers.data.map((ele, index) => {
                return {
                    ...ele,
                    id: index + 1,
                    remove: getButton(ele?._id, 'remove', 'Remove', 'red'),
                }
            });
            setRowData([...data]);
        } else {
            setRowData([]);
        }
        // eslint-disable-next-line
    }, [followers])
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

export default Followers;