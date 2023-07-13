import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    BsBookmark,
    BsBookmarkFill,
    BsCamera,
    BsDot,
    BsHandThumbsUp,
    BsHandThumbsUpFill,
    BsLink45Deg,
    BsShare,
    BsThreeDotsVertical
} from 'react-icons/bs';
import {FaFacebookSquare, FaLinkedin, FaWhatsappSquare, FaWindowClose} from "react-icons/fa"
import {TfiComment} from 'react-icons/tfi';
import {useDispatch, useSelector} from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {toast} from 'react-toastify';
import {createLike, deletePost, getAllLikes, getAllPost, getPost} from "../../Actions/postActions";
import {getAllSavedPost, savePost} from "../../Actions/userActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import Modal from 'react-modal';
import ButtonLoader from "../ButtonLoader";
import useWidthHeight from "../../Hooks/useWidthHeight";
import '../User/User.css';

import {MdArrowBackIosNew, MdArrowForwardIos, MdDelete, MdModeEditOutline} from "react-icons/md";
// import {getAllSavedPost} from "../../Sagas/UserSagas/getAllSavedPost";

Modal.setAppElement('#modal')
const url = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;
const BlogPage = ({socket, type}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userToken = getLocalStorageData('user');
    const {width} = useWidthHeight();
    const {id, postId} = useParams();
    const posts = useSelector(state => state.postData.posts);
    const savedPost = useSelector(state => state.postData.savedPost);
    const savedPostResult = useSelector(state => state.postData.savedPostResult);
    const postResult = useSelector(state => state.postData.postResult);
    const likes = useSelector(state => state.postData.likes);
    const comments = useSelector(state => state.postData.comments);
    const loading = useSelector(state => state.postData.loading);
    const likeLoading = useSelector(state => state.postData.likeLoading);
    const commentLoading = useSelector(state => state.postData.commentLoading);
    const [blog, setBlog] = useState([]);
    const [open, setOpen] = useState({show: false, postId: ''});
    const [modal, setModal] = useState({open: false, data: null, title: null});
    const [comment, setComment] = useState('');
    const blockRef = useRef();
    let subtitle;
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            width: width < 380 ? '300px' : '400px',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (blockRef.current && !blockRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
    }, []);

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setModal({open: false, data: null, title: null});
    }

    useEffect(() => {
        socket.on('message', (data) => {
            toast(data?.text, {type: 'success'});
            let options = {
                body: data?.text,
                icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg",
                dir: "ltr"
            };
            new Notification('Demo Notification', options)
            setModal({open: false, data: null, title: null});
            setComment('');
            postId ? dispatch(getPost({postId})) : dispatch(getAllPost());
        })
        socket.on('messageFrom', (data) => {
            setModal({open: false, data: null, title: null});
            setComment('');
            postId ? dispatch(getPost({postId})) : dispatch(getAllPost());
        })
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (id && type === "Post") {
            let loginUserPost = posts?.filter((ele) => ele?.createdBy === id);
            setBlog([...loginUserPost])
        } else if (id && type === "SavedPost") {
            setBlog([...savedPost])
        } else if (posts && posts.length) {
            const filteredArray = posts?.filter(item => (
                !item.author_info[0].privacy ||
                item.createdBy === userToken?._id ||
                userToken?.following?.includes(item.createdBy)
            ));
            setBlog([...filteredArray]);
        } else {
            setBlog([]);
        }
        // eslint-disable-next-line
    }, [posts, id, postResult, postId, type, savedPostResult, savedPost])

    useEffect(() => {
        if (postId) {
            dispatch(getPost({postId}))
        } else if (type === 'SavedPost') {
            dispatch(getAllSavedPost());
        } else {
            dispatch(getAllPost())
        }
    }, [postId, postResult, savedPostResult, type]);

    const handleCreateLike = (id) => {
        dispatch(createLike({"postId": id, "likeBy": userToken?._id, isSinglePost: postId}))
    }

    const handleSavePost = (id) => {
        dispatch(savePost({id: id}))
    }
    const handleProfile = (e, userId) => {
        navigate(`/profile/${userId}`)
    };
    const handleDate = (date) => {
        let postDate = new Date(date);
        let today = new Date();
        let days = today.getDate() - postDate.getDate();
        if ((today.getMonth() === postDate.getMonth()) && days < 16) {
            return days === 0 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago';
        } else {
            return `${postDate.getDate()} ${postDate.toLocaleString('default', {month: 'long'})} ${postDate.getFullYear()}`;
        }


    };
    const handleShowLikes = (e, id) => {
        e.stopPropagation();
        dispatch(getAllLikes({id, type: 'likes'}));
        setModal({open: true, data: null, title: 'Likes'});
    }
    const handleAddComment = (data) => {
        dispatch(getAllLikes({id: data?._id, type: 'comments'}))
        setModal({open: true, data: data, title: 'Comments'});
    }
    const handleSaveComment = () => {
        socket.emit('commentNotification', {
            content: comment,
            id: modal?.data?.createdBy,
            createdBy: userToken?._id,
            postId: modal?.data?._id,
            userName: userToken?.userName
        })
        setModal({open: false, data: null, title: null});
        setComment('');
    }
    const handleOnChange = (e) => {
        setComment(e.target.value)
    }
    const handleOnShare = (item) => {
        setModal({open: true, data: item, title: 'Share'})
    }
    const handleDeletePost = () => {
        setModal({open: false, data: null, title: null})
        dispatch(deletePost({_id: modal?.data?._id}))
        setOpen({show: false, postId: ''})
    }
    const handleUpdatePost = (data) => {
        navigate('/edit-post', {state: data});
        setOpen({show: false, postId: ''})
    }
    const renderLikeModal = () => (
        <div className="flow-root h-[250px] overflow-y-scroll">
            <ul role="presentation" className="divide-y divide-gray-200 dark:divide-gray-700">
                {likeLoading ? <ButtonLoader/> : <div>
                    {likes && likes?.length && likes?.map((ele, index) => {
                        return (<>
                                <li className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img className="h-8 w-8 rounded-full object-cover"
                                                 src={ele?.profile_url ? ele?.profile_url.includes('https') ? ele?.profile_url : `${url}/${ele?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                 alt=""/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white"
                                               onClick={(e) => handleProfile(e, ele?._id)}>
                                                {ele?.userName}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )
                    })}
                </div>}
            </ul>
        </div>
    )
    const renderCommentModal = () => (
        <>
            <div className="flow-root h-[250px] overflow-y-scroll">
                <ul role="presentation" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {comments?.length ? comments?.map((ele, index) => {
                            return (<>
                                    <li className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <img className="h-8 w-8 rounded-full object-cover"
                                                     src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url : `${url}/${ele?.author_info[0]?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                     alt=""/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white"
                                                   onClick={(e) => handleProfile(e, ele?.createdBy)}>
                                                    {ele?.author_info[0]?.userName}
                                                </p>
                                            </div>
                                            <div
                                                className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                {ele?.content}
                                            </div>
                                        </div>
                                    </li>
                                </>
                            )
                        }) :
                        <div>No Comments</div>
                    }
                </ul>
            </div>
            <div className="relative w-full">
                <input
                    className="bg-gray-100 rounded-[40px] shadow-inner  shadow-gray-700 leading-normal resize-none w-full h-15 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                    id="comment" type="text" placeholder="Comment" name={"comment"}
                    value={comment}
                    onChange={(e) => handleOnChange(e)}
                />
                <button
                    className="text-white absolute w-[25%] rounded-[40px] right-0.5 p-[8px] m-0 bottom-0.5 bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none  font-medium text-sm "
                    onClick={handleSaveComment} disabled={commentLoading || comment === ''}
                >{commentLoading ? <ButtonLoader/> : "Send"}</button>
            </div>
        </>
    )
    console.log("blogs", blog)
    const renderShareModal = () => (
        <>
            <p className="text-sm my-2">Share this link via</p>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div className="w-full flex justify-around">
                    <a href={`whatsapp://send?text=${appUrl}/post/${modal?.data ? modal?.data?.author_info[0]?.userName : 'postById'}/${modal?.data?._id}`}
                       data-action="share/whatsapp/share" rel="noreferrer"
                       target="_blank"> <FaWhatsappSquare color={'#25D366'} size={60}/></a>
                    <a href={`https://www.facebook.com/sharer.php?u=${appUrl}/post/${modal?.data ? modal?.data?.author_info[0]?.userName : 'postById'}/${modal?.data?._id}`}
                       data-action="share/facebook/share" rel="noreferrer"
                       target="_blank"> <FaFacebookSquare color={'#4267B2'} size={60}/></a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}/post/${modal?.data ? modal?.data?.author_info[0]?.userName : 'postById'}/${modal?.data?._id}`}
                       data-action="share/linkedin/share" rel="noreferrer"
                       target="_blank"> <FaLinkedin color={'#0077B5'} size={60}/></a>
                </div>
            </div>
            <p className="text-sm my-2">Or copy link</p>
            <div
                className="border-2 border-gray-200 flex justify-between items-center mt-4 py-2">
                <BsLink45Deg size={30} color={'#4267B2'}/>
                <input className="w-full outline-none bg-transparent" type="text"
                       placeholder="link" value={`${appUrl}/post`}/>

                <button onClick={() => {
                    navigator.clipboard.writeText(`${appUrl}/post/${modal?.data ? modal?.data?.author_info[0]?.userName : 'postById'}/${modal?.data?._id}`);
                    toast('Link Copied', {type: 'success'})
                }}
                        className="bg-indigo-500 text-white rounded text-sm py-2 px-5 mr-2 hover:bg-indigo-600">
                    Copy
                </button>
            </div>
        </>
    )
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <div><MdArrowForwardIos size={15}
                                           className="!bg-gray-200 !rounded-full -ml-4 cursor-pointer hover:!bg-gray-400 !w-10 !h-10 p-2"/>
        </div>,
        prevArrow: <div><MdArrowBackIosNew size={15}
                                           className="!bg-gray-200 !rounded-full -ml-[4px] cursor-pointer hover:!bg-gray-400 !w-10 !h-10 p-2"/>
        </div>
    };
    const renderDeleteModal = () => {
        return (
            <>
                <div className="text-left ">
                    <p className=" text-gray-500 font-medium text-center my-6 mx-6 dark:text-gray-200">
                        Are you sure you want to delete this post ?
                    </p>
                    <div
                        className="px-4 flex flex-row py-4 min-w-min border-l-4 border-red-400 dark:border-gray-200 bg-red-100 dark:bg-gray-700 rounded mx-auto">
                          <span className="w-6 h-6 mr-4 mt-1 text-red-500 dark:text-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20"
                                 fill="currentColor">
                              <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"/>
                            </svg>
                          </span>
                        <div>
                            <h2 className="text-lg font-bold text-red-700 dark:text-gray-100">Warning</h2>
                            <p className="text-sm my-2 text-red-500 dark:text-gray-200 font-medium">You can't undo this
                                action.</p>
                        </div>
                    </div>
                    <div
                        className="flex-row md:flex items-center md:justify-end py-4 text-center mx-auto">
                        <div className="space-y-2 sm:space-x-2 my-4">
                            <button onClick={() => setModal({open: false, data: null, title: null})}
                                    className="modal-close px-5 py-2 text-[14px] bg-gray-500 rounded-lg text-gray-200 font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-gray-100 focus:outline-none">No,
                                Keep it.
                            </button>
                            <button onClick={() => handleDeletePost()}
                                    className="modal-close px-5 py-2 bg-red-500 text-[14px] dark:bg-gray-100 rounded-lg text-gray-200 dark:text-gray-700 font-semibold hover:bg-red-600 dark:hover:bg-white hover:text-gray-100 dark:hover:text-gray-800 focus:outline-none">
                                Yes, Delete Post!
                            </button>

                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            {loading ? <Loader/> :
                <div className='relative lg:overflow-y-scroll lg:h-[80vh]   '>
                    {blog?.length > 0 ? blog?.map((ele, index) => (
                        <div className="" key={index}>
                            {id && userToken._id === id && ele?._id === open?.postId &&
                            <div ref={blockRef}
                                 className={`absolute right-11 z-10 mt-8 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!open.show ? 'hidden' : ''}`}
                                 role="menu"
                                 aria-orientation="vertical"
                                 aria-labelledby="user-menu-button"
                                 tabIndex="-1">
                                <ul className="space-y-2">
                                    <li className='cursor-pointer'>
                                        <div onClick={() => handleUpdatePost(ele)}
                                             className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MdModeEditOutline/>
                                            <span className="ml-3">Update</span>
                                        </div>
                                    </li>
                                    <li className='cursor-pointer'>
                                        <div onClick={() => {
                                            setModal({open: true, data: ele, title: 'Delete'});
                                            setOpen({show: false, postId: ''})
                                        }}
                                             className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MdDelete/>
                                            <span className="ml-3">Delete</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>}

                            <div className='flex items-center justify-center w-full p-2 '>
                                <div className=" p-5 bg-white w-full shadow-lg shadow-gray-400  shadow">
                                    <div className="flex w-full items-center  justify-between border-b pb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="">
                                                <img className="h-8 w-8 rounded-full bg-slate-400 object-cover"
                                                     src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url : `${url}/${ele?.author_info[0]?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                     alt=""/>
                                            </div>
                                            <div className='text-lg font-bold text-slate-700font-bold cursor-pointer'
                                                 onClick={(e) => handleProfile(e, ele?.createdBy)}>
                                                {ele?.author_info[0]?.userName}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-8">
                                            <div className="text-xs text-neutral-500 flex items-center">
                                                <BsDot/> {handleDate(ele?.createdAt)}</div>
                                            {id && userToken._id === id && type === 'Post' &&
                                            <BsThreeDotsVertical className="pointer cursor-pointer"
                                                                 onClick={() => setOpen({
                                                                     show: !open?.show,
                                                                     postId: ele?._id
                                                                 })}/>}
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:px-6 ">
                                        <div className="mb-3 text-xl font-bold">{ele?.title}</div>
                                        <div
                                            className="text-sm text-neutral-600">{ele?.content}</div>
                                        <Slider {...settings} >
                                            {Array.isArray(ele?.imageUrl) ? ele?.imageUrl.map((file, index) => {
                                                    if (file.type === 'video') {
                                                        return <video src={`${url}${file.url}`} autoPlay controls={true}/>
                                                    } else {
                                                        return <img src={`${url}${file.url}`} alt=''
                                                                    className="md:h-[400px] h-[300px] w-full py-2 object-contain"/>
                                                    }
                                                }) :
                                                <img src={`${url}${ele?.imageUrl}`} alt=''
                                                     className="md:h-[400px] h-[300px] w-full object-contain py-2"/>}
                                        </Slider>
                                    </div>
                                    <div>
                                        <div className="sm:px-6 pt-8 pb-2">
                                            {ele?.mentions?.length ? ele.mentions.map((mention, id) => (
                                                <span key={id}
                                                      className={`inline-block bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2`}
                                                      onClick={(e) => handleProfile(e, mention?.id)}>{mention?.name}</span>)) : null}
                                        </div>
                                        <div
                                            className="flex items-center justify-between text-slate-500">
                                            <div className="flex space-x-4 md:space-x-8">
                                                <div
                                                    className="flex items-center text-gray-500 mb-3 flex-wrap max-[560px]:text-[14px] max-[589px]:text-[15px]">
                                                    <div
                                                        className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer"
                                                        onClick={() => handleCreateLike(ele?._id)}>{ele?.likes.includes(userToken?._id) ?
                                                        <BsHandThumbsUpFill color='#3C5AF0'/> :
                                                        <BsHandThumbsUp color='#3C5AF0'/>}&nbsp;&nbsp;<span
                                                        onClick={(e) => handleShowLikes(e, ele?._id)}>{ele?.likes.length} likes</span>
                                                    </div>
                                                    <div
                                                        className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer"
                                                        onClick={() => handleAddComment(ele)}>
                                                        <TfiComment/>&nbsp;&nbsp;{ele?.comments.length} comments
                                                    </div>
                                                    <div onClick={() => handleOnShare(ele)}
                                                         className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer">
                                                        <BsShare/>&nbsp;&nbsp;share
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={() => handleSavePost(ele?._id)}
                                                 className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer">
                                                {ele?.savedBy?.includes(userToken?._id) ? <BsBookmarkFill size={20}/> :
                                                    <BsBookmark size={20}/>
                                                }
                                            </div>
                                        </div>
                                        <div className='ml-3 mb-2'>
                                            # post from <span className='ml-1 text-[#79CCF4]'>{ele?.device}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)) : <>
                        <div className="max-h-[400px] pl-2 items-center">
                            <div
                                className="bg-white h-full rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 py-10">
                                {type === 'SavedPost' ? <>
                                        <div className="flex justify-center px-4 py-8">
                                            <div className="border-black text-center border-[4px]  rounded-full md:p-8 p-4">
                                                <BsBookmark size={80} className="p-2"/>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <h1 className="md:text-6xl text-4xl font-bold text-black pb-4 ">Start
                                                Saving</h1>
                                            <div className='text-gray-600 text-semibold mb-2'>Save photos and videos to your
                                                All Posts collection.
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className="flex justify-center px-4 py-8">
                                            <div
                                                className="border-black text-center border-[4px]  rounded-full md:p-8 p-4">
                                                <BsCamera size={80} className="p-2"/>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <h1 className="md:text-6xl text-4xl font-bold text-black pb-4 ">Share
                                                Posts</h1>
                                            <div className='text-gray-600 text-semibold mb-2'>When you share photos,
                                                they will appear on your profile.
                                            </div>
                                            <div onClick={() => navigate('/post')}
                                                 className='text-sky-600 text-bold cursor-pointer'>Share your first
                                                posts
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>

                        </div>
                    </>}
                </div>}
            <Modal
                isOpen={modal.open}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="max-w-2xl mx-auto ">
                    <div className="p-4 max-w-md bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white"
                                ref={(_subtitle) => (subtitle = _subtitle)}>{modal.title}</h3>
                            <div
                                className="text-sm font-medium  hover:underline dark:text-blue-500"
                                onClick={closeModal}>
                                <FaWindowClose size={25}/>
                            </div>
                        </div>
                        {
                            {
                                Likes: renderLikeModal(),
                                Comments: renderCommentModal(),
                                Share: renderShareModal(),
                                Delete: renderDeleteModal()
                            }[modal.title]
                        }
                    </div>
                </div>
            </Modal>
        </>
    )
};

export default BlogPage;
