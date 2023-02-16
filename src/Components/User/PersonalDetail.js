import React from 'react';

const PersonalDetail = ({user}) => {
    return (
        <>
            <div className="w-full bg-white border-[2px] max-[620px]:px-2 px-4 py-2 justify-start rounded-b-lg">
                <div className='flex max-[460px]:flex-col'>
                    <div className='col ml-7 max-[460px]:ml-1 max-[420px]:mx-0'>
                        <div className='mx-4 my-4'>
                            <div className='text-gray-400'>User Name</div>
                            <div>{user?.userName}</div>
                        </div>
                        <div className='mx-4 my-4 '>
                            <div className='text-gray-400'>Phone</div>
                            <div>{user?.contact}</div>
                        </div>
                    </div>
                    <div className='col ml-7 max-[460px]:ml-1 max-[420px]:mx-0'>
                        <div className='mx-4 my-4 max-[460px]:my-1'>
                            <div className='text-gray-400'>Email</div>
                            <div>{user?.email}</div>
                        </div>
                        <div className='mx-4 my-4'>
                            <div className='text-gray-400'>Birth Date</div>
                            <div>{new Date(user?.birthDate).toLocaleString('default', { month: 'long' })} {new Date(user?.birthDate).getDate()}, {new Date(user?.birthDate).getFullYear()}</div>
                        </div>
                    </div>
                    {/*<div className='col ml-7 max-[460px]:ml-1 max-[420px]:mx-0'>*/}
                    {/*    <div className='mx-4 my-4'>*/}
                    {/*        <div className='text-gray-400'>Followers</div>*/}
                    {/*        <div>{user?.followers?.length}</div>*/}
                    {/*    </div>*/}
                    {/*    <div className='mx-4 my-4 '>*/}
                    {/*        <div className='text-gray-400'>Followings</div>*/}
                    {/*        <div>{user?.following?.length}</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className='flex'>
                    <div className='ml-7 max-[460px]:ml-1 max-[420px]:mx-0'>
                        <div className='mx-4'>
                            <div className='text-gray-400'>About</div>
                            <div>Lorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem EnspumLorem Enspum</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default PersonalDetail;