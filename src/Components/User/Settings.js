import React, {useEffect, useState} from 'react';
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {useDispatch, useSelector} from "react-redux";
import {getDailyUsages, resetSettingResult, setSettings, setUserData} from "../../Actions/userActions";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {barStyle, container} from './Style';
import {toast} from "react-toastify";
import {secondsToHms} from "../../Helper";
import {AiTwotoneSetting} from "react-icons/ai"
import {BsGraphUpArrow, BsFillLockFill} from "react-icons/bs"
import {SiPrivateinternetaccess} from "react-icons/si"
import {GrShieldSecurity} from "react-icons/gr"
import Privacy from "./PrivacySetting";
import useWidthHeight from "../../Hooks/useWidthHeight";
import {useLocation} from "react-router";

const Settings = () => {
    const dispatch = useDispatch();
    const {state} = useLocation();
    const [dailyData, setDailyData] = useState([]);
    const [todayTime, setTodayTime] = useState('');
    const settingResult = useSelector(state => state.userData.settingResult);
    const dailyUsages = useSelector(state => state.userData.dailyUsages);
    const [open , setOpen] = useState(state);
    let userData = getLocalStorageData('user');
    const {width} = useWidthHeight();
    const AccountSetting = ()=>{
        return(
            <div className="px-3 flex items-center bg-grey-light cursor-pointer">
                <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                    <div className="relative flex items-bottom justify-between">
                        <p className="text-black">
                            Account Privacy
                        </p>
                        <div>
                            <label className="inline-flex relative items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={userData?.privacy}
                                    readOnly
                                />
                                <div
                                    onClick={() => {
                                        dispatch(setSettings({id: 'setPrivacy',}));
                                    }}
                                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                                />
                            </label>
                        </div>
                    </div>
                    <div className='flex justify-between rounded-[6px] mt-2.5 border-2 p-5'>
                        <div>
                            <h3>Account Privacy</h3>
                        </div>
                        <div>
                            <label className="inline-flex relative items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={userData?.privacy}
                                    readOnly
                                />
                                <div
                                    onClick={() => {
                                        dispatch(setSettings({id: 'setPrivacy',}));
                                    }}
                                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
    const [active , setActive] = useState({name: 'Account Settings', content: AccountSetting(), icon: <AiTwotoneSetting size={20}/>});
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        if (settingResult?.success) {
            dispatch(resetSettingResult())
        }
    }, [settingResult]);
    useEffect(() => {
        if (dailyUsages?.length) {
            let data = dailyUsages.map((ele) => {
                let d = new Date(ele?.createdAt);
                let dayName = days[d.getDay()];
                return {Day: dayName, Time: ele.time}
            });
            setDailyData([...data]);
            let today = dailyUsages.find(ele => new Date(ele.createdAt).getDate() === new Date().getDate())?.time;
            let hms = secondsToHms(today);
            setTodayTime(hms);
            console.log('data', hms, data)
        }
    }, [dailyUsages])
    useEffect(() => {
        dispatch(getDailyUsages())
    }, []);

    const renderLegend = (data) => {
        return (
            <div className='flex p-2'>
                <div className='flex ml-5'>
                    <div className=''>
                        <span>Daily Average</span>
                    </div>
                    <div className=''>
                        <b style={{color: '#77A3FC'}}>{todayTime}</b>
                    </div>
                </div>
            </div>
        );
    }
    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            return (
                <div className="border-2 bg-white p-3 rounded-[6px]">
                    <p className="label text-[#77A3FC]">{label}</p>
                    <p className="label">{secondsToHms(payload[0]?.payload.Time)}</p>
                </div>
            );
        }
        return null;
    };
    const Graph = () =>{
        return( <div className="px-3  items-center bg-grey-light cursor-pointer">
            <div className='h-[400px] rounded-[6px] mt-2.5 border-2'>
                <ResponsiveContainer width={container.width} height={container.height}>
                    <BarChart
                        width={barStyle.width}
                        height={barStyle.height}
                        data={dailyData}
                        margin={barStyle.margin}
                        cursor="pointer"
                        barSize={barStyle.default}
                    >
                        <CartesianGrid vertical={false} horizontal={true}/>
                        <XAxis dataKey={'Day'} tickLine={false} textAnchor="end" sclaeToFit="true"
                               verticalAnchor="start" interval={0} angle={"-20"} height={70}
                               tick={{fontSize: 11}}/>
                        <YAxis tickCount={barStyle.tickCount} tick={{fontSize: 13}} allowDecimals={false}
                               domain={['dataMin', 'auto']} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip/>}/>
                        <Legend layout='horizontal' verticalAlign='top' align='center'
                                content={renderLegend('')}/>
                        <Bar dataKey="Time" stackId="a" fill="#77A3FC"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>)
    }
    const ChangePassword = ()=>{
        return(
            <div className="px-3 flex items-center bg-grey-light cursor-pointer">
                <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                    <div className="relative  items-bottom justify-between">
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                            <input
                                className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text" placeholder="old password" name='oldPassword'
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                            <input
                                className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text" placeholder="new password" name='newPassword'
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Repeat Password</label>
                            <input
                                className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text" placeholder="repeat password" name='repeatPassword'
                            />
                        </div>
                        <div className="mt-4 w-full"> <label className="block text-gray-700 text-sm font-bold mb-2 hover:underline cursor-pointer hover:text-[#234e70]">Forget Password ?</label></div>
                        <div className="mt-4 w-full flex gap-10">
                            <button
                                className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded bg-white hover:bg-[#234e70]"
                                type="button" >
                                Save Settings
                            </button>
                            <button
                                className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded hover:bg-[#234e70] bg-white "
                                type="button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const DeActivateAccount = () =>{
        return(<>
            <div className="px-3 flex items-center bg-grey-light cursor-pointer">
                <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                    <div className="relative  items-bottom justify-between">
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text" placeholder="Email" name='email'
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="text" placeholder="password" name='password'
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Please Explain Further</label>
                            <textarea
                                className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                name='explanation'>
                        </textarea>
                        </div>
                        <div className="mt-4 w-full flex gap-10">
                            <button
                                className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded bg-white hover:bg-[#234e70]"
                                type="button" >
                                Save Settings
                            </button>
                            <button
                                className="text-black font-bold py-2 mt-5 px-4 w-full border border-gray-300 rounded hover:bg-[#234e70] bg-white "
                                type="button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
    }
    const navBars = [
        {name: 'Account Settings', content: AccountSetting(), icon: <AiTwotoneSetting size={20}/>,},
        {name: 'Status', content: Graph(), icon: <BsGraphUpArrow size={20}/>,},
        {name: 'Change Password', content: ChangePassword(), icon: <BsFillLockFill size={20}/>,},
        {name: 'Deactivate Account', content: DeActivateAccount(), icon: <SiPrivateinternetaccess size={20}/>,},
        {name: 'Privacy', content: <Privacy/>, icon: <GrShieldSecurity size={20}/>},
    ];
    return (
        <>
            <>
                {/*<div className='flex justify-center'>*/}
                {/*    <div className='flex-col w-1/2'>*/}
                {/*        <div className='flex justify-between rounded-[6px] mt-2.5 border-2 p-5'>*/}
                {/*            <div>*/}
                {/*                <h3>Account Privacy</h3>*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <label className="inline-flex relative items-center mr-5 cursor-pointer">*/}
                {/*                    <input*/}
                {/*                        type="checkbox"*/}
                {/*                        className="sr-only peer"*/}
                {/*                        checked={userData?.privacy}*/}
                {/*                        readOnly*/}
                {/*                    />*/}
                {/*                    <div*/}
                {/*                        onClick={() => {*/}
                {/*                            dispatch(setSettings({id: 'setPrivacy',}));*/}
                {/*                        }}*/}
                {/*                        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"*/}
                {/*                    />*/}
                {/*                </label>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className='h-[400px] rounded-[6px] mt-2.5 border-2'>*/}
                {/*            <ResponsiveContainer width={container.width} height={container.height}>*/}
                {/*                <BarChart*/}
                {/*                    width={barStyle.width}*/}
                {/*                    height={barStyle.height}*/}
                {/*                    data={dailyData}*/}
                {/*                    margin={barStyle.margin}*/}
                {/*                    cursor="pointer"*/}
                {/*                    barSize={barStyle.default}*/}
                {/*                >*/}
                {/*                    <CartesianGrid vertical={false} horizontal={true}/>*/}
                {/*                    <XAxis dataKey={'Day'} tickLine={false} textAnchor="end" sclaeToFit="true"*/}
                {/*                           verticalAnchor="start" interval={0} angle={"-20"} height={70}*/}
                {/*                           tick={{fontSize: 11}}/>*/}
                {/*                    <YAxis tickCount={barStyle.tickCount} tick={{fontSize: 13}} allowDecimals={false}*/}
                {/*                           domain={['dataMin', 'auto']} axisLine={false} tickLine={false}/>*/}
                {/*                    <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip/>}/>*/}
                {/*                    <Legend layout='horizontal' verticalAlign='top' align='center'*/}
                {/*                            content={renderLegend('')}/>*/}
                {/*                    <Bar dataKey="Time" stackId="a" fill="#77A3FC"/>*/}
                {/*                </BarChart>*/}
                {/*            </ResponsiveContainer>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </>
            {width < 600 && open && <nav className="fixed bottom-0 z-50 w-full bg-white items-center flex p-4">

                <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                    <div onClick={()=>setOpen(!open)}>close</div>
                    <ul
                        className={`flex-col justify-center items-center w-full first:mt-2 md:flex-row md:w-auto md:space-x-10 md:flex`}>
                        {navBars.map((ele, index) => {
                            return (
                                <li>
                                    <div className={`px-3 flex items-center  cursor-pointer ${active.name === ele.name?' text-[#234e70] font-bold ':' hover:text-[#234e70] '}`} onClick={()=>setActive(ele)}>
                                        <div className={`ml-4 flex-1 border-b ${active.name === ele.name? 'border-[#234e70]':'border-grey-lighter'} py-4`}>
                                            <div className="flex items-bottom gap-5">
                                                {ele.icon} <p className="text-grey-darkest">{ele.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>}
            <div>
                <div className="w-full"></div>
                <div className="container mx-auto">
                    <div className="py-12 h-screen">
                        <div className="flex border border-grey rounded shadow-lg h-full">
                            <div className="w-1/3 border hidden sm:flex flex-col">
                                <div className="bg-gray-lighter flex-1 overflow-auto">
                                    {navBars.map((ele) =>(<div className={`px-3 flex items-center  cursor-pointer ${active.name === ele.name?' text-[#234e70] font-bold ':' hover:text-[#234e70] '}`} onClick={()=>setActive(ele)}>
                                        <div className={`ml-4 flex-1 border-b ${active.name === ele.name? 'border-[#234e70]':'border-grey-lighter'} py-4`}>
                                            <div className="flex items-bottom gap-5">
                                                {ele.icon} <p className="text-grey-darkest">{ele.name}</p>
                                            </div>
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                            <div className="w-full sm:w-2/3 border flex flex-col">
                                <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <p className="text-grey-darkest">
                                            </p>
                                            <p className="text-grey-darker text-xs mt-1">
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-grey-lighter flex-1 overflow-auto sm:px-12">
                                    <div className="px-3 flex items-center bg-grey-light cursor-pointer">
                                        <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                                            <div className="flex items-bottom justify-between">
                                                <p className="text-lg font-bold text-[#234e70]">
                                                    {active.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {active.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Settings;
