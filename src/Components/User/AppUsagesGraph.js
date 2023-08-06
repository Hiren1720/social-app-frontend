import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {secondsToHms} from "../../Helper";
import {getDailyUsages} from "../../Actions/userActions";
import {barStyle, container} from "./Style";



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
const AppUsagesGraph = () =>{
    const dispatch = useDispatch();
    const [dailyData, setDailyData] = useState([]);
    const [todayTime, setTodayTime] = useState('');
    const dailyUsages = useSelector(state => state.userData.dailyUsages);
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    useEffect(() => {
        dispatch(getDailyUsages())
        // eslint-disable-next-line
    }, []);
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
        }
        // eslint-disable-next-line
    }, [dailyUsages]);
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
};

export default AppUsagesGraph;