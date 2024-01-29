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

                            <ul role="list "
                                className="divide-y divide-gray-200 dark:divide-gray-700 w-full">
                                {rowData?.length ? rowData.map((ele,index)=> (<li className="p-3 sm:p-4">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="flex-shrink-0 p-1 rounded-full">
                                            <img className="w-12 h-12 rounded-full"
                                                 src={ele?.author_info[0]?.profile_url}
                                                 alt="request image"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {ele?.author_info[0]?.userName}{" "}has requested to follow you
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                1 hour ago
                                            </p>
                                        </div>
                                    </div>
                                </li>) ):<div className='flex justify-center'>
                                    No request found
                                </div>}

                            </ul>
            }
        </>
    )
};

export default Requests;
