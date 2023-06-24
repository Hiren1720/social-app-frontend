import React from "react";
const PortFolio = () =>{
    return(
        <div>
            <div className="container mx-auto pt-72 lg:visible max-[1024px]:hidden ">
                <div
                    className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg shadow-gray-400 rounded-lg -mt-64 ">
                    <div className="px-1 ">
                        <div
                            className="relative bg-gradient-to-br from-sky-50 to-gray-200 ">
                            <div
                                className="relative  m-auto  text-gray-500">
                                <div className="m-auto ">
                                    <div className="bg-white">
                                        <div className="p-4">
                                            <div className="space-y-4">
                                                <h2 className="text-2xl text-cyan-900 font-bold border-b">Portfolio</h2>
                                            </div>
                                            <div className="mt-8 grid space-y-4">
                                                <div
                                                    className="grid grid-cols-6 col-span-2 gap-2">
                                                    <div
                                                        className="overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                                                        <img
                                                            className="h-full w-full object-cover "
                                                            src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
                                                            alt=""/>
                                                    </div>
                                                    <div
                                                        className="overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                                                        <img
                                                            className="h-full w-full object-cover  "
                                                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80"
                                                            alt=""/>
                                                    </div>
                                                    <div
                                                        className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                        <img
                                                            className="h-full w-full object-cover "
                                                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                                            alt=""/>
                                                    </div>
                                                    <div
                                                        className=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                                            alt=""/>
                                                    </div>
                                                    <div
                                                        className="relative overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                                                        <div
                                                            className="text-white text-xl absolute inset-0  bg-slate-900/80 flex justify-center items-center">
                                                            + 23
                                                        </div>
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
                                                            alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="mt-10 space-y-4 text-gray-600 text-center ">
                                                <p className="text-xs">By proceeding, you
                                                    agree to
                                                    our <a href=""
                                                           className="underline">Disclaimer</a> and
                                                    confirm you have read our <a href=""
                                                                                 className="underline">Privacy
                                                        and Cookie Statement</a>.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PortFolio;
