import React, {useEffect, useState, useRef} from 'react';
import {useNavigate,Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteAccount, logout} from "../../Actions/userActions";
import {getRequests} from "../../Actions/requestActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {AiFillHome} from 'react-icons/ai';
import {HiUsers} from 'react-icons/hi';
import {FaUserPlus,FaUsers} from 'react-icons/fa';
import {MdAddComment} from 'react-icons/md';
const url = process.env.REACT_APP_API_URL;
const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requests = useSelector(state => state.requestData.userRequests);
    const deleteAccountResult = useSelector(state => state.userData.deleteAccountResult);
    const pathName = window.location.pathname;
    const navBars = [
        {name:'Home',path:'/',icon:<AiFillHome className="ml-3" size={15}/>,},
        // {name:'Followers',path:'/followers',icon:<HiUsers className="ml-5"/>,},
        {name:'Users',path:'/users',icon:<FaUsers className="ml-3"/>,},
        {name:'Requests',path:'/requests',icon:<FaUserPlus className="ml-5"/>,},
        {name:'Post',path:'/post',icon:<MdAddComment className="ml-2"/>},
    ]
    const [active,setActive] = useState('Dashboard');
    const [open,setOpen] = useState(false);
    const [collapse,setCollapse] = useState(false);
    let userToken = getLocalStorageData('user');
    const blockRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (blockRef.current && !blockRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
    }, []);
    useEffect(()=> {
        if(deleteAccountResult && deleteAccountResult?.success && deleteAccountResult?.type === 'delete-account'){
            navigate('/verify-otp')
        }
    },[deleteAccountResult])
    useEffect(()=>{
        if(userToken){
            dispatch(getRequests({type:'user'}))
        }else {
            navigate('/login')
        }
        // eslint-disable-next-line

    },[]);
    useEffect(()=> {
        if(pathName !== '/'){
            let path = pathName.slice(1).charAt(0).toUpperCase() + pathName.slice(2);
            setActive(path);
        }
        else {
            setActive('Home');
        }
        setCollapse(false);
        setOpen(false);
        // eslint-disable-next-line
    },[pathName,requests]);
    const handleProfile = () => {
        navigate(`/profile/${userToken?._id}`);
        setOpen(false);
    };
    return (
        <>
            <nav className="relative sticky top-0 bg-white z-40 border-b border-neutral-200">
                <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button"
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-controls="mobile-menu" onClick={()=> setCollapse(!collapse)} aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                {!collapse ? <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                                    </svg>:
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>}
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between ">
                            <div className="flex flex-shrink-0 items-center">
                                <img className="block h-8 w-auto lg:hidden"
                                     src={require('../../assets/images/favicon.png')}
                                     alt="Your Company"/>
                                <img className="hidden h-8 w-auto lg:block"
                                     src={require('../../assets/images/favicon.png')}
                                     alt="Your Company"/>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navBars.map((ele,index)=>(
                                        <div className='relative inline-flex w-fit' key={index}>
                                            {(ele?.name ==='Requests' && requests?.data?.length) ? <div
                                                className="absolute top-0 right-0 bottom-auto left-auto z-10 inline-block translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-700 py-1 px-2.5 text-center align-baseline text-xs font-bold leading-none text-white">
                                                {requests?.data?.length}
                                            </div>:null}
                                            <span onClick={()=> {navigate(ele.path); setActive(ele.name)}}
                                                  className={`px-3 gap-2 cursor-pointer py-2 text-center rounded-md text-sm font-medium ${active === ele.name?' text-[#fa6a48] ':'text-gray-300  hover:text-[#fa6a48] '}`}
                                                  aria-current="page">
                                                {ele?.icon}<span>{ele?.name}</span>
                                            </span>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button type="button"
                                    className="rounded-full bg-gray-800 hidden p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                                </svg>
                            </button>

                            <div className="relative ml-3">
                                <div onClick={()=> setOpen(!open)}>
                                    <button type="button"
                                            className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="h-8 w-8 rounded-full object-cover"
                                             src={userToken?.profile_url.includes('https') ? userToken?.profile_url : `${url}/${userToken?.profile_url}`}
                                             alt=""/>
                                    </button>
                                </div>
                                <div ref={blockRef}
                                    className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!open ?'hidden':''}`}
                                    role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                    tabIndex="-1">
                                    <span onClick={()=> handleProfile()} className={`block px-4 py-2 text-sm cursor-pointer hover:text-white hover:bg-gray-900 hover:rounded-[6px] text-gray-700 ${pathName.includes('/profile/') ? 'bg-gray-900 text-white rounded-[6px]':''}`} role="menuitem"
                                          tabIndex="-1" id="user-menu-item-0">Your Profile</span>
                                    <span onClick={()=> {navigate('/settings')}} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:text-white hover:bg-gray-900 hover:rounded-[6px]" role="menuitem"
                                          tabIndex="-1" id="user-menu-item-1">Settings</span>
                                    <span onClick={()=> {dispatch(deleteAccount({type:'delete-account'})); setOpen(!open)}} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:text-white hover:bg-gray-900 hover:rounded-[6px]" role="menuitem"
                                          tabIndex="-1" id="user-menu-item-2">Delete Account</span>
                                    <span onClick={()=> dispatch(logout())} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:text-white hover:bg-gray-900 hover:rounded-[6px]" role="menuitem"
                                          tabIndex="-1" id="user-menu-item-3">Sign out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {collapse ? <div className="sm:hidden z-40 absolute bg-gray-800 w-full" id="mobile-menu">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navBars.map((ele,index)=>(
                            <div className='relative inline-flex w-fit' key={index}>
                                {(ele?.name ==='Requests' && requests?.data?.length) ? <div
                                    className="absolute top-0 right-0 bottom-auto left-auto z-10 inline-block translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-700 py-1 px-2.5 text-center align-baseline text-xs font-bold leading-none text-white">
                                    {requests?.data?.length}
                                </div>:null}
                                <span onClick={()=> {navigate(ele.path); setActive(ele.name)}}
                                      className={`block px-3 py-2 rounded-md text-base font-medium ${active === ele.name?'bg-gray-900 text-white':'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                      aria-current="page">{ele?.icon}{ele?.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>:null}
            </nav>
            <Outlet/>
        </>
    )
}
export default Header;
