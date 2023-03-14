import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateRequest} from "../../Actions/requestActions";
import Table from "../Table";
import Loader from "../Layouts/Loader";


const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector(state => state.requestData.userRequests);
    const loading = useSelector(state => state.requestData.buttonLoading);
    const userData = useSelector(state => state.userData.loggedInUser);
    const [rowData, setRowData] = useState([]);
    const headers = ['id', 'content', 'accept', 'reject'];
    const getButton = (id, status, text, color) => {
        return <button
            className={`w-[50px] h-[30px] border-none bg-[${color}] rounded-[5px] text-[white] cursor-pointer`}
            onClick={() => handleRequest(id, status)}>{text}
        </button>
    }
    useEffect(() => {
        if (requests && requests.data && requests.data.length) {
            let data = requests.data.map((ele, index) => {
                return {
                    ...ele,
                    id: index + 1,
                    accept: getButton(ele?._id, 'accepted', 'Accept', 'green'),
                    reject: getButton(ele?._id, 'rejected', 'Reject', 'red'),
                }
            });
            setRowData([...data]);
        } else {
            setRowData([]);
        }
        // eslint-disable-next-line
    }, [requests])
    const handleRequest = (id, status) => {
        dispatch(updateRequest({id: id, status: status}))
    }
    const getRequestStatus = ({_id}) => {
        let status = requests && requests.data && requests.data.find((ele) => ele?.toUserId === _id)?.status;
        let data = 'Follow';
        if (status === 'pending') {
            data = 'Requested';
        }
        else if(userData && userData?.following.includes(_id)){
            data = 'UnFollow'
        }
        return data;
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='flex justify-evenly items-center rounded-[5px] flex-col p-8'>
                    <div className='overflow-x-auto relative"'>
                        <Table headers={headers} rowData={rowData}/>
                        {rowData?.length && rowData.map((ele,index)=> (
                            <div key={index}>
                            <div className="flex p-4 border-[2px] mx-2 h-[150px] justify-between rounded-[10px] cursor-pointer hover:bg-grey-900" onClick={(e)=> {}}>
                                <div className='flex items-center '>
                                    <div className="">
                                        <img className="h-[70px] w-[70px] rounded-full"
                                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                             alt=""/>
                                    </div>
                                    <div className="ml-4">
                                        <div
                                            className="w-full relative text-gray-600 focus-within:text-gray-400">
                                            <div className='font-semibold max-[480px]:text-[14px]'>
                                                {ele?.content}
                                            </div>
                                            <div className='text-gray-500 max-[480px]:text-[14px]'>
                                                {ele?.userName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={(e) => {}}
                                            className={`appearance-none max-[480px]:text-[14px] block w-75 text-blue-700 rounded py-2 px-4 leading-tight ${ele?._id === userData?._id ? 'hidden':''} bg-gray-200 focus:border-gray-400 border border-gray-200`}
                                            id="grid-last-name" type="button">{getRequestStatus(ele)}
                                    </button>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>}
        </>
    )
};

export default Requests;