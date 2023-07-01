import React, {useEffect, useState} from 'react';
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {useDispatch, useSelector} from "react-redux";
import {getDailyUsages, resetSettingResult, setSettings} from "../../Actions/userActions";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {barStyle, container} from './Style';
import {toast} from "react-toastify";
import {secondsToHms} from "../../Helper";


const Settings = () => {
    const dispatch = useDispatch();
    const [dailyData, setDailyData] = useState([]);
    const [todayTime, setTodayTime] = useState('');
    const settingResult = useSelector(state => state.userData.settingResult);
    const dailyUsages = useSelector(state => state.userData.dailyUsages);
    let userData = getLocalStorageData('user');
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
    }, [])
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
    return (
        <>
            <div className='flex justify-center'>
                <div className='flex-col w-1/2'>
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
                </div>
            </div>
        </>
    )
};

export default Settings;