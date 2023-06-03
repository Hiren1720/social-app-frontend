import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateRequest} from "../../Actions/requestActions";
import Loader from "../Layouts/Loader";
const url = process.env.REACT_APP_API_URL;
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
    }, [requests])
    const handleRequest = (id, status) => {
        dispatch(updateRequest({id: id, status: status}))
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='flex justify-evenly items-center rounded-[5px] flex-col p-6'>
                    <div className='overflow-x-auto relative"'>
                        {rowData?.length ? rowData.map((ele,index)=>

                                (<div className="flex  flex-col gap-4 items-center bg-white w-full mb-4">
                                    <div  className=" border-2 border-b-4 border-gray-200 rounded-xl hover:bg-gray-50">
                                        <p
                                            className="bg-sky-500 w-fit px-4 py-1 text-sm font-bold text-white rounded-tl-lg rounded-br-xl"> STATUS </p>
                                        <div className="flex p-5 gap-y-2 items-center">
                                            <div>
                                                <img src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url: `${url}/${ele?.author_info[0]?.profile_url}` :"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} className="max-w-16 max-h-16 rounded-full"/>
                                            </div>
                                            <div className="col-span-5 md:col-span-4 ml-4 ">
                                                <p className="font-bold">{ele?.author_info[0]?.userName}{" "}has requested to follow you</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end p-2">
                                            <button onClick={() => {handleRequest(ele?._id, 'accepted')}}
                                                    className={`appearance-none max-[480px]:text-[14px] block w-75 text-blue-500 font-bold rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                                    id="grid-last-name" type="button">Accept
                                            </button>
                                            <button onClick={() => {handleRequest(ele?._id, 'rejected')}}
                                                    className={`ml-3 appearance-none max-[480px]:text-[14px] block w-75 text-red-700 font-bold rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                                    id="grid-last-name" type="button">Reject
                                            </button>
                                        </div>
                                    </div>

                                </div>)
                        ):<div className='flex justify-center'>
                            No request found
                        </div>}
                    </div>
                </div>}
        </>
    )
};

export default Requests;
