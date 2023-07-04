import React from 'react';

const PersonalDetail = ({user}) => {
    let date = new Date(user?.birthDate).toLocaleString('default', { month: 'long' });
    let month = new Date(user?.birthDate).getDate();
    let year = new Date(user?.birthDate).getFullYear();
    return (
        <>
            <div className="w-full py-2 justify-start ">
                <div className='bg-white max-[460px]:flex-col'>
                    <div className=' bg-white shadow-lg shadow-gray-400'>
                        <div className='col mx-7 grid md:grid-cols-1 text-base gap-2 max-[460px]:mx-1 max-[420px]:mx-0'>
                            <div className='mx-4 my-4 grid grid-cols-1'>
                                <label htmlFor="first-name" className="block  font-medium text-gray-700 mb-[10px]">Name</label>
                                <input type="text" name="first-name" placeholder="name" id="first-name" autoComplete="given-name" disabled
                                       value={user?.name}
                                       className="focus:ring-indigo-500 focus:border-indigo-500 font-bold block w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className='col  mx-7 max-[460px]:mx-1 max-[420px]:mx-0 grid md:grid-cols-1 text-base gap-2'>
                            <div className='mx-4 my-4 grid grid-cols-1'>
                                <label htmlFor="first-name" className="block  font-medium text-gray-700 mb-[10px]">Phone</label>
                                <input type="text" name="phone" placeholder="Phone number" id="first-name" autoComplete="given-name" disabled
                                       value={user?.contact}
                                       className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 font-bold border  border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className='col  mx-7 max-[460px]:mx-1 max-[420px]:mx-0 grid md:grid-cols-1 text-base gap-2'>
                            <div className='mx-4 my-4 max-[460px]:my-1 grid grid-cols-1'>
                                <label htmlFor="first-name" className="block  font-medium text-gray-700 mb-[10px]">Email</label>
                                <input type="text" name="first-name" placeholder="email@gmail.com" id="first-name" autoComplete="given-name" disabled
                                       value={user?.email}
                                       className="focus:ring-indigo-500 focus:border-indigo-500 block w-full font-bold  py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className='col  mx-7 max-[460px]:mx-1 max-[420px]:mx-0 grid md:grid-cols-1 text-base gap-2'>
                            <div className='mx-4 my-4 grid grid-cols-1'>
                                <label htmlFor="last-name" className="block  font-medium text-gray-700 mb-[10px]">
                                    Birthday</label>
                                <input type="text" name="bdate" placeholder="Birth Date" id="bdate" disabled
                                       autoComplete="family-name" value={date === "Invalid Date" ? "": date +' '+ month+' ' + year}
                                       className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full font-bold  w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className=' mx-7 max-[460px]:mx-1 max-[420px]:mx-0 grid md:grid-cols-1 text-base gap-2'>
                            <div className='mx-4 mb-10 grid grid-cols-1'>
                                <label htmlFor="first-name" className="block  font-medium text-gray-700  mb-[10px]">About</label>
                                <textarea type="text" name="first-name" disabled placeholder="bio" id="first-name"autoComplete="given-name"
                                          value={user?.bio}
                                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 border border-slate-200 font-bold rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default PersonalDetail;
