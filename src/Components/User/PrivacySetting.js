import React,{useState} from "react";
import {MdArrowDropDown,MdArrowDropUp} from "react-icons/md"
const Privacy = () =>{
    const [open , setOpen] = useState({content:'',subContent:''})
    const privacy = [
        {content:' Who can see your email address', subContent:'Choose who can see your email address on your profile'},
        {content:' Who can see your friends',subContent:'Choose who can see your list of connections'},
        {content:'Manage who can discover your profile from your email address',subContent:'Choose who can discover your profile if they are not connected to you but have your email address'},
        {content:'Search history',subContent:'Clear all previous searches performed on LinkedIn'},
    ]
    const description = () =>{
        return(<ul className=" px-3 pb-3 overflow-y-auto text-sm text-gray-700 text-gray-200">
            <li>
                <div className="flex items-center pl-2 rounded hover:bg-gray-100 text-gray-600">
                    {open.subContent}
                </div>
            </li>
            {open.content !== 'Search history' ? <><li>
                    <div className="flex items-center pl-2 rounded ">
                        <input id="checkbox-item-11" type="checkbox" value=""
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        <label htmlFor="checkbox-item-11"
                               className="w-full py-2 ml-2 text-sm font-medium text-gray-600 rounded">Everyone</label>
                    </div>
                </li>
                    <li>
                        <div className="flex items-center pl-2 rounded hover:bg-gray-100 ">
                            <input checked id="checkbox-item-12" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="checkbox-item-12"
                                   className="w-full py-2 ml-2 text-sm font-medium text-gray-600 rounded">Friends</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input id="checkbox-item-13" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="checkbox-item-13"
                                   className="w-full py-2 ml-2 text-sm font-medium text-gray-600 rounded">Only me</label>
                        </div>
                    </li></>:
                <li>
                    <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input id="checkbox-item-13" type="checkbox" value=""
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        <label htmlFor="checkbox-item-13"
                               className="w-full py-2 ml-2 text-sm font-medium text-gray-600 rounded">Clear All History</label>
                    </div>
                </li>
            }
        </ul>)
    }
    const handleToggle = (ele)=>{
        if(ele.content === open.content){
            setOpen({content:''})
        }
        else{
            setOpen(ele)
        }
    }
    return(<>{privacy.map((ele)=>(<div className="px-3 flex items-center bg-gray-light cursor-pointer" >
        <div className="ml-4 flex-1 border-b border-gray-lighter py-4">
            <div className="flex items-bottom justify-between" onClick={()=>handleToggle(ele)}>
                <p className="text-black">
                    {ele.content}
                </p>
                <div>{ele.content === open.content ? <MdArrowDropUp/>:<MdArrowDropDown/>}</div>
            </div>
            {ele.content === open.content && description()}
        </div>
    </div>))}</>)
}
export default Privacy;
