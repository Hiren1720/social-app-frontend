import React from "react";

const Loader = () => {
    return <div className="flex justify-center items-center h-screen bg-grey-300">
        <div className="grid gap-2">
            <div className="flex items-center justify-center ">
                <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
        </div>
    </div>
};
export default Loader;
