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
import {HiOutlineEmojiHappy} from "react-icons/hi";
import Picker from 'emoji-picker-react';
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
    const [postLength , setPostLength] = useState(0);
    const loading = useSelector(state => state.userData.loading);
    let userToken = getLocalStorageData('user');
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [importError, setImportError] = useState(null);
    const onEmojiClick = (text) => {
        setThought({...thought, content: thought.content + text.emoji})
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
        dispatch(getProfile({id: userToken?._id,isLoggedInUser:true}));
        dispatch(getProfileViewers());
        // dispatch(getRequests({type:'user'}));
        dispatch(getRequests({type:'allRequest'}));
        dispatch(setRequest());
    }
    const handleOnShare = () => {
        // let formData = new FormData();
        const device = getDeviceName()
        // Array.from(thought?.imageUrl).forEach(file => {
        //     formData.append('postImage', file);
        // });
        console.log("create post", device)
        let postData = {...thought, createdBy: userToken?._id, device: device, type: 'create'}
        // formData.append('post', JSON.stringify(postData));
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
                            setFiles([...files,...imageFiles]);
                            console.log('thought?.imageUrl',thought?.imageUrl,imageFiles)
                            setThought({...thought, imageUrl: [...thought?.imageUrl, ...imageFiles]});
                            setImportError(null);
                        })
                        .catch(err => console.log(err));
                }
            });
        }
        else {
            setImportError('You can post maximum 10 files!');
        }

    }

    return(
        <>
            {loading ? <Loader/> :
                <>
                    {(userData) ? <>
                        <>
                            <div className="bg-white">
                                <div
                                    className="relative bg-blueGray-200 flex-col lg:grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:row-span-2 ">
                                    <div>
                                        <div
                                            className=" flex-col max-[1024px]:flex items-center  homeProfile fadeInLeft lg:visible max-[1024px]:hidden">
                                            <div
                                                className="relative flex flex-col items-center shadow-lg shadow-md shadow-gray-400 rounded-[5px] mx-auto p-5 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                                <div
                                                    className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
                                                    <div className="bg-pink-400 absolute flex h-32 w-full justify-center rounded-xl bg-cover"/>
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
                                                    className="relative flex flex-col shadow-lg shadow-gray-400 min-w-0 break-words bg-white w-full mb-6  rounded-lg -mt-8 max-[400px]:-mt-8 ">
                                                    <div className="px-1 ">
                                                        <div
                                                            className="relative bg-gradient-to-br from-sky-50 to-gray-200 ">
                                                            <div
                                                                className="relative m-auto text-black-500 grid-cols-3 ">
                                                                <div className="m-auto ">
                                                                    <div className="mt-[1px] mb-[1px] bg-white ">
                                                                        <div className="p-4 border-b font-bold">
                                                                            <h3>Suggestion </h3>
                                                                        </div>
                                                                        <div>
                                                                            {profileViewers && profileViewers?.length ? profileViewers.filter(ele => !userData.followings.includes(ele?.author_info[0]?._id)).map((ele,index)=>{
                                                                                let status = getStatus(ele?.author_info[0],requestAll,userData,'Followings',true);
                                                                                return(
                                                                                <div className="m-auto text-gray-600 " key={index}>
                                                                                    <div
                                                                                        className="bg-white justify-between">
                                                                                        <div className="flex items-center justify-between px-4 py-3  gap-2 lg:gap-1">
                                                                                            <div className='flex cursor-pointer' onClick={()=> handleProfile(ele?.author_info[0])}>
                                                                                                <img className="w-12 h-12 rounded-full object-cover mr-4 "
                                                                                                     src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url :`${url}${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
                                                                                                     alt="avatar"/>
                                                                                                <div className="flex items-center justify-between">
                                                                                                    <h2 className="text-lg items-center font-semibold text-gray-900 md:text-sm -mt-1">{ele?.author_info[0]?.name}</h2>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex items-center text-2xl cursor-pointer" onClick={(e)=>{handleRequest(e,ele?.author_info[0],status)}}>
                                                                                                {getIcon(status)}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}) :''}
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
                                    <div
                                        className="col-span-1 lg:col-span-2 sm:col-span-5 max-[490px]:col-span-5 h-96 ">
                                        <div className="flex items-center  bg-white justify-center shadow-lg mb-4 ">
                                            <div className="w-full bg-white rounded-lg px-4 pt-2">
                                                <div className='border-2 border-pink-400'/>
                                                <div className="flex flex-wrap -mx-3 mb-6">
                                                    <div className="w-full  flex md:w-full px-3 mb-2 mt-2 items-center">
                                                        <div
                                                            className="flex  items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                                            <img className="rounded-full h-[45px] w-[50px] object-cover"
                                                                 src={userData?.profile_url ? userData?.profile_url.includes('https') ? userData?.profile_url : `${url}/${userData?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                 alt=""/>
                                                        </div>
                                                        <div className="relative w-full">
                                                            <input
                                                                className="bg-gray-100 rounded-[40px] shadow-inner  shadow-gray-700 leading-normal resize-none w-full h-15 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                                                id="comment" type="text" placeholder="Say Something"
                                                                name={"comment"}
                                                                value={thought.content}
                                                                onChange={(e) => {setOpen(false); setThought({...thought, content: e.target.value})}}
                                                            />
                                                            <button type='button' onClick={() => handleOnShare()}
                                                                    disabled={thought === ''}
                                                                    className="cursor-pointer text-white absolute w-[20%] rounded-[40px] right-0 p-[10px] m-0 bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none  font-medium  text-sm "
                                                            >Share
                                                            </button>

                                                        </div>
                                                    </div>
                                                    <div className="icons flex text-black m-2 relative">
                                                        <div onClick={() => {
                                                            setOpen(!open)
                                                        }}
                                                             className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7 text-bold"
                                                        ><HiOutlineEmojiHappy size={18}/>
                                                        </div>
                                                        <div
                                                            className="mr-2 relative cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7 flex"
                                                        ><input type='file' id={`fileInput`} className=' w-5 opacity-0 absolute'
                                                                onChange={(e) => {
                                                                    handleOnImportFile(e.target.files);
                                                                    e.preventDefault();
                                                                }}
                                                                multiple={true}
                                                                accept={"image/png, image/jpeg, image/jpg, video/mp4, video/mp3"}
                                                        /><GrGallery/>
                                                        </div>
                                                        {files.length > 0 &&
                                                        <p className="items-center flex text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">{files?.length}</span> files Selected</p>}
                                                    </div>
                                                </div>
                                                {open && <div className='w-full'>
                                                    <Picker onEmojiClick={onEmojiClick}  width="100%"/>
                                                </div>}
                                            </div>
                                        </div>
                                        <div >
                                            <Post type={'getAllPost'}/>
                                        </div>
                                    </div>
                                    <div>
                                        {requests?.data?.length > 0 && <div
                                            className="bg-blueGray-50 homeProfile fadeInRight max-[1024px]:hidden visible shadow-md">
                                            <div className="w-full">
                                                <div
                                                    className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
                                                    <div className="p-2 ">
                                                        <div className="space-y-4 pb-5">
                                                            <h2 className="text-2xl text-cyan-900 font-bold border-b p-2">Recent
                                                                Notification</h2>
                                                        </div>
                                                        <Requests/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="shadow-xl animate-pulse max-[1024px]:hidden visible">

                                            <div
                                                className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                                <img className="rounded-t-lg p-8"
                                                     src="https://image.coolblue.nl/840x473/content/49a851e5fe9a5c48bdfa94364b35f0ab"
                                                     alt="product"/>
                                                <div className="px-5 pb-5">
                                                    <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">Apple
                                                        Watch Series 7
                                                        GPS, Aluminium Case, Starlight Sport</h3>
                                                    <div className="flex items-center mt-2.5 mb-5">
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor"
                                                             viewBox="0 0 20 20"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                            </path>
                                                        </svg>
                                                        <span
                                                            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                            <span
                                                className="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
                                                        <span
                                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add
                                                            to cart</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </> : <></>}
                </>
            }
        </>
    );
}
export default Home;
