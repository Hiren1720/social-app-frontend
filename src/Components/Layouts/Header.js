import React, {useEffect, useState} from 'react';
import {Outlet} from "react-router";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../Actions/userActions";
import {getRequests} from "../../Actions/requestActions";
import {getTokenObject} from "../../Helper/TokenHandler";



const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requests = useSelector(state => state.requestData.userRequests);
    const pathName = window.location.pathname;
    const navBars = [
        {name:'Dashboard',path:'/'},
        {name:'Followers',path:'/followers'},
        {name:'Followings',path:'/followings'},
        {name:'Requests',path:'/requests'},
        {name:'Post',path:'/post'},
    ]
    const [active,setActive] = useState('Dashboard');
    const [open,setOpen] = useState(false);
    const [collapse,setCollapse] = useState(false);
    let userToken = getTokenObject();
    useEffect(()=>{
        if(userToken){
            dispatch(getRequests({type:'user'}))
        }
        // eslint-disable-next-line
    },[pathName]);
    useEffect(()=> {
        if(pathName !== '/'){
            let path = pathName.slice(1).charAt(0).toUpperCase() + pathName.slice(2);
            setActive(path);
        }
        else {
            setActive('Dashboard');
        }
        setCollapse(false);
        setOpen(false);
        // eslint-disable-next-line
    },[pathName,requests]);
    const handleProfile = () => {
        navigate(`/profile/${userToken?.user_id}`);
        setOpen(false);
    };
    return (
        <>
            <nav className="relative sticky top-0 bg-gray-800 z-40">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
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
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <img className="block h-8 w-auto lg:hidden"
                                     src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                     alt="Your Company"/>
                                    <img className="hidden h-8 w-auto lg:block"
                                         src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                         alt="Your Company"/>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navBars.map((ele,index)=>(
                                        <span onClick={()=> {navigate(ele.path); setActive(ele.name)}} key={index}
                                              className={`px-3 cursor-pointer py-2 rounded-md text-sm font-medium ${active === ele.name?'bg-gray-900 text-white':'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                              aria-current="page">{ele?.name}{' '}{(ele?.name ==='Requests' && requests && requests.data && requests.data.length) ? `(${requests?.data?.length})`:''}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button type="button"
                                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                                        <img className="h-8 w-8 rounded-full"
                                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                             alt=""/>
                                    </button>
                                </div>
                                <div
                                    className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!open ?'hidden':''}`}
                                    role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                    tabIndex="-1">
                                    <span onClick={()=> handleProfile()} className={`block px-4 py-2 text-sm cursor-pointer hover:text-white hover:bg-gray-900 hover:rounded-[6px] text-gray-700 ${pathName.includes('/profile/') ? 'bg-gray-900 text-white rounded-[6px]':''}`} role="menuitem"
                                       tabIndex="-1" id="user-menu-item-0">Your Profile</span>
                                    <span onClick={()=> dispatch(logout())} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:text-white hover:bg-gray-900 hover:rounded-[6px]" role="menuitem"
                                       tabIndex="-1" id="user-menu-item-2">Sign out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {collapse ? <div className="sm:hidden z-40 absolute bg-gray-800 w-full" id="mobile-menu">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navBars.map((ele,index)=>(
                            <span onClick={()=> {navigate(ele.path); setActive(ele.name)}} key={index}
                                  className={`block px-3 py-2 rounded-md text-base font-medium ${active === ele.name?'bg-gray-900 text-white':'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                  aria-current="page">{ele?.name}{' '}{(ele?.name ==='Requests' && requests && requests.data && requests.data.length) ? `(${requests?.data?.length})`:''}</span>
                        ))}
                    </div>
                </div>:null}
            </nav>
            <Outlet/>
        </>
    )
}
export default Header;