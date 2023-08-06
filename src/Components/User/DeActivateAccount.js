import React from "react";

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
};

export default DeActivateAccount;