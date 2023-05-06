import React, {useEffect,useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getAllUsers} from "../../Actions/userActions";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";
import { FaSearch,FaFilter} from "react-icons/fa";
import { BsArrowLeft} from "react-icons/bs";
import {getRequests} from "../../Actions/requestActions";


const Users = () => {
    const [searchValue,setSearchValue] = useState('');
    const [page,setPage] = useState(0);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.userData.loading);
    const users = useSelector(state => state.userData.users);

    useEffect(() => {
        dispatch(getAllUsers({page,pageSize:4,searchValue}));
        dispatch(getRequests({type: 'allRequest'}));
        // eslint-disable-next-line
    }, []);

    const handleClearSearch = () => {
        setSearchValue('');
        dispatch(getAllUsers({page,pageSize:4,searchValue:''}));
    }
    return (
        <>
            {loading ? <Loader/> :
                <div>
                    <div className='flex flex-row mb-2 mt-4 px-3'>
                        <div
                            className="w-[300px] px-3 mb-6 md:mb-0 relative text-gray-600 focus-within:text-gray-400">
                            <span className="absolute inset-y-3 left-3 flex pl-2" onClick={()=> { searchValue && handleClearSearch()}}>
                                { searchValue ? <BsArrowLeft /> : <FaSearch/>}
                            </span>
                            <input
                                className="appearance-none pl-10 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:border-gray-400  focus:bg-white"
                                id="grid-first-name" value={searchValue} onChange={(e)=> setSearchValue(e.target.value)}  type="text" placeholder="Search"/>
                        </div>
                        <div className="w-full pl-3">
                            <button onClick={()=> dispatch(getAllUsers({page,pageSize: 4,searchValue}))}
                                className="appearance-none block w-75 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:border-gray-400"
                                id="grid-last-name" type="button"><FaFilter size='20' color={'gray'}/></button>
                        </div>
                    </div>
                    <UserSlider data={users} title={'Users'}/>
                </div>}
        </>
    )
};

export default Users;
