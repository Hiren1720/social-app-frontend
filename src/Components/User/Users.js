import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getAllUsers, getProfile} from "../../Actions/userActions";
import Loader from "../Layouts/Loader";
import UserSlider from "../Common/UserSlider";
import {FaSearch, FaFilter, FaUsers, FaUserPlus} from "react-icons/fa";
import {BsArrowLeft} from "react-icons/bs";
import {FiSearch} from "react-icons/fi";
import {RxCross2} from "react-icons/rx";
import {getFollowers, getRequests, setRequest} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {AiFillHome} from "react-icons/ai";
import {HiUsers} from "react-icons/hi";
import {MdAddComment} from "react-icons/md";
import "./User.css";

const Users = () => {
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const loading = useSelector(state => state.userData.loading);
    const user = useSelector(state => state.userData.users);
    const followUsers = useSelector(state => state.requestData.followFollowing);
    const totalUsers = useSelector(state => state.userData.totalUsers);
    const followTotalUsers = useSelector(state => state.requestData.totalUsers);
    const [data,setData] = useState([]);
    const [searchField , setSearchField] = useState(false)
    const userData = getLocalStorageData('user');
    const [active, setActive] = useState('Users');
    useEffect(() => {
        if (user?.length) {
            setUsers([...users, ...user]);
        } else {
            setUsers([]);
            setPage(0);
        }
    }, [user]);
    useEffect(()=> {
        if(followUsers?.length){
            setData([...data,...followUsers]);
        }
        else {
            setData([]);
            setPage(0);
        }
    },[followUsers, active]);
    useEffect(() => {
        receiveUsers();
        dispatch(getRequests({type: 'allRequest'}));
        dispatch(getProfile({id: userData?._id, isLoggedInUser: true}));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (requestResult && requestResult?.success) {
            if(active !== 'Users'){
                dispatch(getFollowers({page: 0, pageSize: 100,type: active, id: userData?._id,isLoading:true}));
            }
            else{
                dispatch(getAllUsers({page: 0, pageSize: 100, searchValue: '', isLoading: true}));
            }
            dispatch(getProfile({id: userData?._id, isLoggedInUser: true}));
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(setRequest());
        }
        // eslint-disable-next-line
    }, [requestResult]);
    useEffect(() => {
        if (page !== 0) {
            setPage(0);
        }
        setUsers([]);
        setData([]);
        receiveUsers(page !== 0);
        // eslint-disable-next-line
    }, []);
    useEffect(() =>{
        setPage(0);
        setUsers([]);
        setData([]);
        receiveUsers(page !==0)

        // eslint-disable-next-line
    }, [active]);
    const receiveUsers = (isFirstPage) => {
        setPage(pre => pre + 1);
        if(active !== 'Users'){
            dispatch(getFollowers({page:isFirstPage? 0: page, pageSize, type:active,id: userData?._id,isLoading:true}));
        }
        else{
            dispatch(getAllUsers({page: isFirstPage? 0: page, pageSize: pageSize, searchValue: '', isLoading: true}));
        }
    }
    const handleClearSearch = () => {
        setSearchValue('');
        setPage(0);
        setUsers([]);
        dispatch(getAllUsers({page: 0, pageSize: pageSize, searchValue: '', clearAll: true}));
    }
    const navBars = [
        {name: 'Users', path: '/'},
        {name: 'Followers', path: '/followers' },
        {name: 'Followings', path: '/followers'},
    ]
    const handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            setUsers([]);
            setPage(0);
            dispatch(getAllUsers({page:0, pageSize: 4, searchValue}));
        }
    }
    return (
        <>
            {loading ? <Loader/> :
                <>
                    <nav className="sticky top-[4.05rem] overflow-x-scroll sm:overflow-hidden bg-white border-b border-neutral-200 z-40  ">
                        <div className=" sm:ml-6  flex justify-between">
                            <div className="flex">
                                {navBars.map((ele, index) => (
                                    <div className='relative inline-flex w-fit' key={index}  onClick={() => setActive(ele.name)}>
                                    <span onClick={() => ""}
                                          className={`px-3 gap-2 cursor-pointer py-2 text-center rounded-sm text-sm font-medium ${active === ele.name ? 'border-b-4 border-black text-black' : 'text-[#999]'}`}
                                          aria-current="page"> <span>{ele?.name}</span>
                                    </span>
                                    </div>
                                ))}
                            </div>
                            <div className=' flex gap-2 items-center divide-x'>
                                <div className="text-[#999] p-4 uppercase text-xs">{userData?.followers?.length } Friends</div>
                                {active === 'Users' && <> {searchField && <div className='h-full'>
                                    <input type="text" onChange={(e) => setSearchValue(e.target.value)}
                                           onKeyDown={(e) => handleKeyPress(e)}
                                           className="mr-4 sm:w-full w-[200px] p-2  h-full text-sm focus:border-blue-500  focus:outline-none"
                                           placeholder="Search your friends" value={searchValue}/>
                                </div>}
                                    <div className='p-4' onClick={() => {
                                        setSearchField(!searchField);
                                        handleClearSearch();
                                    }}>{searchField ? <RxCross2/> : <FiSearch/>}</div>
                                </>}
                            </div>
                        </div>
                    </nav>
                    <div className='2xl:mx-40 lg:mx-10 mx-0'>
                        <UserSlider data={active === "Users" ? users:data} total={active === 'Users' ? totalUsers:followTotalUsers} receiveUsers={receiveUsers} title={active}/>
                    </div>
                </>
            }
        </>
    )
};

export default Users;
