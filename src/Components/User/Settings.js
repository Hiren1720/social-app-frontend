import React, {useEffect, useState} from 'react';
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {useDispatch, useSelector} from "react-redux";
import {resetSettingResult, setSettings} from "../../Actions/userActions";
import {AiTwotoneSetting} from "react-icons/ai"
import {BsGraphUpArrow, BsFillLockFill} from "react-icons/bs"
import {SiPrivateinternetaccess} from "react-icons/si"
import {GrShieldSecurity} from "react-icons/gr"
import Privacy from "./PrivacySetting";
import useWidthHeight from "../../Hooks/useWidthHeight";
import {useLocation} from "react-router-dom";
import {MdOutlineKeyboardBackspace,MdArrowForward} from "react-icons/md";
import AppUsagesGraph from "./AppUsagesGraph";
import ChangePassword from "./ChangePassword";
import DeActivateAccount from "./DeActivateAccount";
const Settings = () => {
    const dispatch = useDispatch();
    const {state} = useLocation();
    const settingResult = useSelector(state => state.userData.settingResult);
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
                </div>
            </div>
        )
    };
    const [active , setActive] = useState({name: 'Account Settings', icon: <AiTwotoneSetting size={20}/>});


    useEffect(() => {
        if (settingResult?.success) {
            dispatch(resetSettingResult())
        }
        // eslint-disable-next-line
    }, [settingResult]);
    const navBars = [
        {name: 'Account Settings', icon: <AiTwotoneSetting size={20}/>,},
        {name: 'Status', icon: <BsGraphUpArrow size={20}/>,},
        {name: 'Change Password', icon: <BsFillLockFill size={20}/>,},
        {name: 'Deactivate Account', icon: <SiPrivateinternetaccess size={20}/>,},
        {name: 'Privacy', icon: <GrShieldSecurity size={20}/>},
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
           <>      <div>
               <div className="w-full"></div>
               <div className="container mx-auto">
                   <div className="py-12 h-screen">
                       {width < 640 && <div onClick={()=>setOpen(!open)}>{open ? <MdArrowForward size={30}/>:<MdOutlineKeyboardBackspace size={30}/>}</div>}
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
                               {width < 640 && open ? <nav className="">
                                       <div className="bg-grey-lighter flex-1 overflow-auto sm:px-12">
                                           <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                                               <ul
                                                   className={`flex-col justify-center items-center w-full first:mt-2 md:flex-row md:w-auto md:space-x-10 md:flex`}>
                                                   {navBars.map((ele, index) => {
                                                       return (
                                                           <li>
                                                               <div className={`px-3 flex items-center  cursor-pointer ${active.name === ele.name?' text-[#234e70] font-bold ':' hover:text-[#234e70] '}`} onClick={()=>{setActive(ele); width < 640 && setOpen(false)}}>
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
                                       </div>
                                   </nav>:
                                   <>
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
                                           {{
                                               'Account Settings':<AccountSetting/>,
                                               'Status': <AppUsagesGraph/>,
                                               'Change Password': <ChangePassword/>,
                                               'Deactivate Account': <DeActivateAccount/>,
                                               'Privacy': <Privacy/>,
                                           }[active.name]}
                                       </div>
                                   </>}
                           </div>
                       </div>
                   </div>
               </div>
           </div></>
        </>
    )
};

export default Settings;
