import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Post from '../Posts/Posts';
import {useDispatch, useSelector} from "react-redux";
import {getRequests, sendRequest, setRequest, updateRequest} from "../../Actions/requestActions";
import {getProfile, getProfileViewers} from "../../Actions/userActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import '../User/User.css';
import Requests from "../FollowFollowing/Requests";
import Loader from "../Layouts/Loader";
import {createPost, resetPostResult} from "../../Actions/postActions";
import getDeviceName from "../../Helper/getDeviceName";
import {getIcon, getStatus, tobase64Handler} from "../../Helper";
import {GrGallery} from 'react-icons/gr';
import {HiOutlineEmojiHappy, HiPencilAlt} from "react-icons/hi";
import {BsThreeDots} from "react-icons/bs";
import {BiSolidEditAlt, BiPhotoAlbum, BiCamera, BiPlus} from "react-icons/bi";
import {MdOutlineVideocam} from "react-icons/md";
import Picker from 'emoji-picker-react';
import useWidthHeight from "../../Hooks/useWidthHeight";
import Story from "../User/Story";
import {RxCross2} from "react-icons/rx";
const url = process.env.REACT_APP_API_URL;
const Home = () => {
    const [thought, setThought] = useState({content: '', imageUrl: []});
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData.loggedInUser);
    const navigate = useNavigate();
    const profileViewers = useSelector(state => state.userData.profileViewers);
    const requests = useSelector(state => state.requestData.userRequests);
    const posts = useSelector(state => state.postData.posts);
    const profile = useSelector(state => state.userData.profile);
    const requestAll = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const postResult = useSelector(state => state.postData.postResult);
    const [postLength, setPostLength] = useState(0);
    const loading = useSelector(state => state.userData.loading);
    let userToken = getLocalStorageData('user');
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [importError, setImportError] = useState(null);
    const [publishTab, setPublishTab] = useState('Publish');
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const {width} = useWidthHeight();
    const onEmojiClick = (text) => {
        console.log("text", text)
        // setThought({...thought, content: thought.content + text.emoji})
        setThought((prevState)=> ({
            ...prevState,
            content :prevState.content + text.emoji

        }));
    };
    useEffect(() => {
        if (postResult?.success) {
            dispatch(resetPostResult());
            setThought({content: "", imageUrl: []});
            setFiles([]);
        }
        // eslint-disable-next-line
    }, [postResult])
    useEffect(() => {
        if (requestResult && requestResult.success) {
            callApis();
        }
        // eslint-disable-next-line
    }, [requestResult]);
    useEffect(() => {
        let loginUserPost = posts?.filter((ele) => {
            return ele?.createdBy === userToken?._id;
        });
        setPostLength(loginUserPost.length)
        // eslint-disable-next-line
    }, [postLength, posts])
    useEffect(() => {
        if (userToken) {
            callApis();
        }
        // eslint-disable-next-line
    }, [profile]);
    const callApis = () => {
        dispatch(getProfile({id: userToken?._id, isLoggedInUser: true}));
        dispatch(getProfileViewers());
        // dispatch(getRequests({type:'user'}));
        dispatch(getRequests({type: 'allRequest'}));
        dispatch(setRequest());
    }
    const handleOnShare = () => {
        setOpenPublishModal(false)
        const device = getDeviceName()
        let postData = {...thought, createdBy: userToken?._id, device: device, type: 'create'}
        dispatch(createPost(postData));
    }
    const handleRequest = (e, item, status) => {
        if (status === 'Follow') {
            dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
        } else if (status === 'Requested') {
            let req = requestAll?.data && requestAll.data.filter(ele => ele?.fromUserId === userData?._id).find((ele) => ele?.toUserId === item?._id);
            if (req) {
                dispatch(updateRequest({id: req?._id, status: status}));
            }
        }
    };
    const handleProfile = (data) => {
        navigate(`/profile/${data?._id}`);
    };
    const handleOnImportFile = async (fileData) => {
        // if (fileData.length <= 10 || thought.imageUrl.length < 10) {
        //     Array.from(fileData).forEach((ele, id) => {
        //         let extension = ele.name.split('.').pop().replace(' ', '');
        //         if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png' && extension !== 'mp4') {
        //             setImportError('Post Only JPEG,JPG & PNG File');
        //         } else {
        //             setImportError(null);
        //         }
        //         setThought({...thought, imageUrl: [thought.imageUrl, ...fileData]});
        //     })
        //     let file = await tobase64Handler(Array.from(fileData));
        //     setFiles([...files, ...file]);
        // }
        const cloudName = 'socialposts';
        const uploadPreset = 'postimagevideo';
        let imageFiles = [];
        const formData = new FormData();
        if (fileData.length <= 10 || thought.imageUrl.length < 10) {
            Array.from(fileData).forEach((ele, id) => {
                let extension = ele.name.split('.').pop().replace(' ', '');
                if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png' && extension !== 'mp4') {
                    setImportError('Post Only JPEG,JPG & PNG File');
                } else {
                    formData.append('file', ele);// ele
                    formData.append('upload_preset', uploadPreset);
                    const options = {
                        method: 'POST',
                        body: formData
                    };
                    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, options)
                        .then(res => res.json())
                        .then(res => {
                            imageFiles.push(res.secure_url);
                            setFiles([...files, ...imageFiles]);
                            console.log('thought?.imageUrl', thought?.imageUrl, imageFiles)
                            setThought({...thought, imageUrl: [...thought?.imageUrl, ...imageFiles]});
                            setImportError(null);
                        })
                        .catch(err => console.log(err));
                }
            });
        } else {
            setImportError('You can post maximum 10 files!');
        }

    }

    function closeModal() {
        // setModal({open: false, data: null, title: null});
    }


    return (
        <>
            {loading ? <Loader/> :
                <>
                    {(userData) ? <>
                        <>
                            <div className="bg-[#f4f4f4] 2xl:mx-40 md:mx-4 sm:pt-4">
                                <div
                                    className="relative bg-blueGray-200 flex-col lg:grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:row-span-2 ">
                                    <div>
                                        <div
                                            className=" flex-col max-[1024px]:flex items-center  homeProfile fadeInLeft lg:visible max-[1024px]:hidden">
                                            <div
                                                className="relative flex flex-col items-center shadow-lg  shadow-gray-400 rounded-2xl mx-auto p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                                <div
                                                    className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
                                                    <div
                                                        className="bg-pink-400 absolute flex h-32 w-full justify-center rounded-xl bg-cover"/>
                                                    <div
                                                        className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                                        <img
                                                            className="h-full w-full rounded-full object-cover"
                                                            src={userData?.profile_url ? userData?.profile_url.includes('https') ? userData?.profile_url : `${url}/${userData?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                            alt=""/>
                                                    </div>
                                                </div>
                                                <div className="mt-16 flex flex-col items-center">
                                                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                                        {userData?.name}
                                                    </h4>
                                                    <p className="text-base font-normal text-gray-600">{userData?.userName}</p>
                                                </div>
                                                <div
                                                    className="mt-6 mb-3 flex gap-14 md:!gap-14 max-[1200px]:flex-col max-[1024px]:flex-row flex-row">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p
                                                            className="text-2xl font-bold text-navy-700 dark:text-white">{userData?.posts?.length}</p>
                                                        <p className="text-sm font-normal text-gray-600">Posts</p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                            {userData?.followers?.length}
                                                        </p>
                                                        <p className="text-sm font-normal text-gray-600">Followers</p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                                            {userData?.followings?.length}
                                                        </p>
                                                        <p className="text-sm font-normal text-gray-600">Following</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mx-0 homeProfile fadeInLeft max-[1024px]:hidden visible'>
                                            <div
                                                className="container mx-auto lg:pt-12 flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-1 2xl:row-span-2">
                                                <div
                                                    className="relative flex flex-col shadow-lg shadow-gray-400 min-w-0 break-words bg-white w-full mb-6  rounded-2xl -mt-8 max-[400px]:-mt-8 ">
                                                    <div
                                                        className=" bg-white rounded-2xl border   dark:bg-gray-800 dark:border-gray-700">
                                                        <div
                                                            className="flex justify-between items-center p-6 border-b border-neutral-200">
                                                            <h3 className="text-sm font-bold leading-none text-gray-900 dark:text-white">Suggestion</h3>
                                                        </div>
                                                        <div className="flow-root">
                                                            <ul role="list"
                                                                className="divide-y divide-gray-200 dark:divide-gray-700 w-full">
                                                                {profileViewers?.length ? profileViewers.filter(ele => !userData.followings.includes(ele?.author_info[0]?._id)).map((ele, index) => {
                                                                    let status = getStatus(ele?.author_info[0], requestAll, userData, 'Followings', true);
                                                                    return (
                                                                        <li className="p-3">
                                                                            <div
                                                                                className="flex items-center space-x-4">
                                                                                <div
                                                                                    className="bg-white justify-between w-full">
                                                                                    <div
                                                                                        className="flex items-center justify-between px-4  w-full gap-2 lg:gap-1">
                                                                                        <div
                                                                                            className='flex cursor-pointer'
                                                                                            onClick={() => handleProfile(ele?.author_info[0])}>
                                                                                            <img
                                                                                                className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                                src={ele?.author_info[0]?.profile_url}
                                                                                                alt="avatar"/>
                                                                                            <div
                                                                                                className="flex items-center justify-between">
                                                                                                <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">{ele?.author_info[0]?.name}</h2>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div
                                                                                            className="flex items-center text-2xl cursor-pointer"
                                                                                            onClick={(e) => {
                                                                                                handleRequest(e, ele?.author_info[0], status)
                                                                                            }}>
                                                                                            {getIcon(status)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>)
                                                                }) : ""}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div
                                        className="col-span-1 lg:col-span-2 sm:px-4 sm:col-span-5 max-[490px]:col-span-5 h-96 ">
                                        <div
                                            className={`flex items-center  bg-white justify-center rounded-2xl shadow-lg mb-4 flex-col `}>
                                            <div
                                                className={`w-full bg-white ${openPublishModal ? '' : 'rounded-2xl border'} px-4  pt-2`}>
                                                <div className='border-2 border-pink-400'/>
                                                {/*<span onClick={()=>setOpenPublishModal(false)}>Close</span>*/}
                                                <ul className="flex flex-wrap text-sm font-medium items-center justify-between text-center text-gray-500 dark:border-gray-700 dark:text-gray-400 bg-gray-100 overflow-x-auto">
                                                    <div className='flex '>
                                                        {[{tab: 'Publish', icon: <BiSolidEditAlt/>}, { tab: 'Albums',icon: <BiPhotoAlbum/> }, {tab: 'Video', icon: <MdOutlineVideocam/>}].map((ele) => (
                                                            <li className="" onClick={() => {
                                                                setPublishTab(ele.tab)
                                                            }}>
                                                                <a href="#" aria-current="page"
                                                                   className={` p-4 flex gap-1 items-center hover:text-gray-700  rounded-t-lg ${publishTab === ele.tab && 'bg-white'} hover:bg-white dark:bg-gray-800 dark:text-blue-500 hover:border-x hover:border-t border-gray-200`}>
                                                                    <div>{ele.icon}</div>
                                                                    {ele.tab}</a>
                                                            </li>))}
                                                    </div>
                                                   {openPublishModal &&  <div className="flex items-center p-[3px] mr-2 bg-gray-200 border-black text-neutral-400 rounded-full cursor-pointer"  onClick={() => {
                                                        setOpenPublishModal(false)
                                                    }}><RxCross2/></div>}
                                                </ul>

                                                <div className="flex flex-wrap -mx-3 mb-4">
                                                    <div
                                                        className="w-full  flex md:w-full px-3 mb-2 mt-4 items-start border-b border-neutral-200">
                                                        <div
                                                            className="flex  items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                                            <img className="rounded-full h-[45px] w-[50px] object-cover"
                                                                 src={userData?.profile_url ? userData?.profile_url.includes('https') ? userData?.profile_url : `${url}/${userData?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                 alt=""/>
                                                        </div>
                                                        <div className="relative w-full">
                                                            <div
                                                                className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800"
                                                                onClick={() => {
                                                                    setOpenPublishModal(true)
                                                                }}>
                                                                <textarea id="comment" rows="4" name={"comment"}
                                                                          className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 focus:outline-none"
                                                                          placeholder="Write a comment..."
                                                                          value={thought?.content}
                                                                          onChange={(e) => {
                                                                              setOpen(false);

                                                                              setThought({
                                                                                  ...thought,
                                                                                  content: e.target.value
                                                                              })
                                                                          }}
                                                                          required></textarea>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="icons flex text-black m-2 relative">
                                                        <span onClick={() => {
                                                            setOpen(!open)
                                                        }}
                                                              className={`gap-1 flex bg-[#f7f7f7] text-[#888da8] rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2 hover:text-gray-700 cursor-pointer`}
                                                        ><HiOutlineEmojiHappy size={18} className='bg-yellow'/>Activity</span>
                                                        {/*</div>*/}
                                                        <div
                                                            className="mr-2 relative items-center cursor-pointer hover:text-gray-700 border  p-1 h-7  gap-1 flex bg-[#f7f7f7] text-[#888da8] rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2"
                                                        ><input type='file' id={`fileInput`}
                                                                className=' w-5 opacity-0 absolute'
                                                                onChange={(e) => {
                                                                    e.preventDefault();
                                                                    handleOnImportFile(e.target.files);
                                                                }}
                                                                multiple={true}
                                                                accept={"image/png, image/jpeg, image/jpg, video/mp4, video/mp3"}
                                                        /><BiCamera/> Media
                                                        </div>
                                                        {files.length > 0 &&
                                                        <p className="items-center flex text-sm text-gray-500 dark:text-gray-400">
                                                                <span
                                                                    className="font-semibold">{files?.length}</span> files
                                                            Selected</p>}
                                                        <span
                                                            className={`gap-1 flex bg-[#f7f7f7] text-[#888da8] rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2 hover:text-gray-700 cursor-pointer`}
                                                        ><BsThreeDots size={18} className='bg-yellow'/></span>
                                                    </div>

                                                </div>
                                                {open && <div className='w-full'>
                                                    <Picker onEmojiClick={onEmojiClick} width="100%"/>
                                                </div>}
                                            </div>
                                            {openPublishModal && <div
                                                className={`rounded-b-2xl border bg-white dark:border-neutral-600 dark:bg-neutral-800 w-full p-2`}>
                                                <div className="mb-0 flex gap-3 h-[40px]">
                                                    <button
                                                        className="px-3 text-xs w-32 font-medium border border-neutral-200 text-center flex justify-center  items-center text-[#888da8] bg-white rounded-lg   focus:outline-none  "
                                                        type="button">
                                                        View
                                                    </button>
                                                    <button type="button" disabled={thought === ''}
                                                            onClick={() => handleOnShare()}
                                                            className="px-3 text-xs w-full font-medium text-center flex justify-center  items-center text-white bg-[#5596e6] rounded-lg   focus:outline-none ">
                                                        Publish
                                                    </button>
                                                </div>

                                            </div>}
                                        </div>

                                        <div>
                                            <Post type={'getAllPost'}/>
                                        </div>

                                    </div>
                                    <div>
                                        {requests?.data?.length > 0 && <div
                                            className="bg-blueGray-50 homeProfile fadeInRight max-[1024px]:hidden visible shadow-md rounded-2xl">
                                            <div className="w-full">
                                                <div
                                                    className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-2xl">
                                                    <div className="p-2 ">
                                                        <div className="space-y-4">
                                                            <h2 className="text-sm text-cyan-900 font-bold border-b p-2">Recent
                                                                Notification</h2>
                                                        </div>
                                                        <Requests/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="shadow-xl rounded-2xl max-[1024px]:hidden visible">
                                           <Story/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<PublishPostModal handleOnImportFile={handleOnImportFile}*/}
                            {/*                  setPublishTab={setPublishTab}*/}
                            {/*                  publishTab={publishTab}*/}
                            {/*                  setOpen={setOpen}*/}
                            {/*                  setThought={setThought}*/}
                            {/*                  files={files}*/}
                            {/*                  opens={open}*/}
                            {/*                  closeModal={closeModal}*/}
                            {/*                  open={openPublishModal}*/}
                            {/*                  userData={userData}*/}
                            {/*                  onEmojiClick={onEmojiClick}*/}
                            {/*                  width={width}*/}
                            {/*/>*/}
                        </>
                    </> : <></>}
                </>
            }
        </>
    );
}
export default Home;
