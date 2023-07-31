import React, {useEffect,useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getAllUsers, getProfile} from "../../Actions/userActions";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";
import { FaSearch,FaFilter} from "react-icons/fa";
import { BsArrowLeft} from "react-icons/bs";
import {getRequests, setRequest} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";


const Users = () => {
    const [searchValue,setSearchValue] = useState('');
    const [page,setPage] = useState(0);
    const pageSize = 10;
    const dispatch = useDispatch();
    const [users,setUsers] = useState([]);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const loading = useSelector(state => state.userData.loading);
    const user = useSelector(state => state.userData.users);
    const totalUsers = useSelector(state => state.userData.totalUsers);
    const userData = getLocalStorageData('user');
    useEffect(()=> {
        if(user?.length){
            setUsers([...users,...user]);
        }
        else {
            setUsers([]);
            setPage(0);
        }
    },[user])
    useEffect(() => {
        receiveUsers();
        dispatch(getRequests({type: 'allRequest'}));
        dispatch(getProfile({id: userData?._id,isLoggedInUser:true}));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (requestResult && requestResult?.success) {
            dispatch(getAllUsers({page: 0, pageSize: 100, searchValue: '',isLoading:true}));
            dispatch(getProfile({id: userData?._id,isLoggedInUser:true}));
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    }, [requestResult]);

    const receiveUsers = () => {
        setPage(pre => pre + 1);
        dispatch(getAllUsers({page: page, pageSize: pageSize, searchValue: '',isLoading:true}));
    }
    const handleClearSearch = () => {
        setSearchValue('');
        dispatch(getAllUsers({page:0,pageSize:pageSize,searchValue:'',clearAll:true}));
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='mx-48  max-[1500px]:mx-[30px] '>
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
                    <UserSlider data={users} total={totalUsers} receiveUsers={receiveUsers} title={'Users'}/>
                </div>}
        </>
    )
};

export default Users;
