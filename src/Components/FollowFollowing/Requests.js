import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateRequest} from "../../Actions/requestActions";
import Loader from "../Layouts/Loader";
import {url} from "../../Helper/constants";


const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector(state => state.requestData.userRequests);
    const loading = useSelector(state => state.requestData.buttonLoading);
    const userData = useSelector(state => state.userData.loggedInUser);
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        if (requests && requests.data && requests.data.length) {
            setRowData([...requests.data]);
        } else {
            setRowData([]);
        }
        // eslint-disable-next-line
    }, [requests])
    const handleRequest = (id, status) => {
        dispatch(updateRequest({id: id, status: status}))
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='flex justify-evenly items-center rounded-[5px] flex-col p-8'>
                    <div className='overflow-x-auto relative"'>
                        {rowData?.length ? rowData.map((ele,index)=> (
                            <div key={index}>
                            <div className="flex p-4 border-[2px] mx-2 h-[150px] justify-between rounded-[10px] cursor-pointer hover:bg-grey-900" onClick={(e)=> {}}>
                                <div className='flex items-center mr-3'>
                                    <div className="">
                                        <img className="h-[70px] w-[70px] rounded-full"
                                             src={ele?.author_info[0]?.profile_url ? `${url}/${ele?.author_info[0]?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                             alt=""/>
                                    </div>
                                    <div className="ml-4">
                                        <div
                                            className="w-full relative text-gray-600 focus-within:text-gray-400">
                                            <div className='font-semibold max-[480px]:text-[14px]'>
                                                {ele?.author_info[0]?.userName}{" "}has requested to follow you
                                            </div>
                                            <div className='text-gray-500 max-[480px]:text-[14px]'>
                                                {ele?.userName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={() => {handleRequest(ele?._id, 'accepted')}}
                                            className={`appearance-none max-[480px]:text-[14px] block w-75 text-blue-700 rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                            id="grid-last-name" type="button">Accept
                                    </button>
                                    <button onClick={() => {handleRequest(ele?._id, 'rejected')}}
                                            className={`ml-3 appearance-none max-[480px]:text-[14px] block w-75 text-red-700 rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                            id="grid-last-name" type="button">Reject
                                    </button>
                                </div>
                            </div>
                            </div>
                        )):<div className='flex justify-center'>
                            No request found
                        </div>}
                    </div>
                </div>}
        </>
    )
};

export default Requests;