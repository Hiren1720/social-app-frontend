import React from "react";
import {FiLock} from 'react-icons/fi'
const PrivateAccount = () =>{
    return(   <>
        <div className="max-h-[400px] pl-2 items-center " data-testid='account-private'>
            <div
                className="bg-white h-full rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 py-10 px-4">
                <div className="flex justify-center px-4 py-8">
                    <div
                        className="border-black text-center border-[4px]  rounded-full md:p-8 p-4">
                        <FiLock size={80} className="p-2"/>
                    </div>
                </div>
                <div className='text-center'>
                    <h1 className="md:text-6xl text-4xl font-bold text-black pb-4 ">This
                        Account is Private</h1>
                    <div className='text-gray-600 text-semibold mb-2'>Follow
                        this account to see their photos and videos.
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default PrivateAccount;
