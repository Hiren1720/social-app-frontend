import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {BsDot, BsHandThumbsUp, BsHandThumbsUpFill, BsShare, BsThreeDotsVertical} from 'react-icons/bs';
import {FaFacebookSquare, FaLinkedin, FaShareAlt, FaWhatsappSquare, FaWindowClose} from "react-icons/fa"
import {TfiComment} from 'react-icons/tfi';
import {useDispatch, useSelector} from "react-redux";
import {toast} from 'react-toastify';
import {createLike, deletePost, getAllLikes, getAllPost, getPost} from "../../Actions/postActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import Modal from 'react-modal';
import {getCommentsById} from "../../Actions/commentAction";
import ButtonLoader from "../ButtonLoader";
import useWidthHeight from "../../Hooks/useWidthHeight";
import '../User/User.css';

import {MdDelete, MdModeEditOutline} from "react-icons/md";

Modal.setAppElement('#modal')
const url = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;
const BlogPage = ({socket}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userToken = getLocalStorageData('user');
    const {width} = useWidthHeight();
    const {id, postId} = useParams();
    const posts = useSelector(state => state.postData.posts);
    const postResult = useSelector(state => state.postData.postResult);
    const likes = useSelector(state => state.postData.likes);
    const comments = useSelector(state => state.postData.comments);
    const loading = useSelector(state => state.postData.loading);
    const likeLoading = useSelector(state => state.postData.likeLoading);
    const commentLoading = useSelector(state => state.postData.commentLoading);
    const [blog, setBlog] = useState([]);
    const [open, setOpen] = useState({show: false, postId: ''});
    const [sharePost, setSharePost] = useState({show: false, data: null})
    const [showLike, setShowLike] = useState(false);
    const [showComment, setShowComment] = useState({show: false, data: null});
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
        setShowLike(false);
    }

    useEffect(() => {
        socket.on('message', (data) => {
            toast(data?.text, {type: 'success'});
            var options = {
                body: data?.text,
                icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg",
                dir: "ltr"
            };
            new Notification('Demo Notification', options)
            setShowComment({show: false, data: {}});
            setComment('');
            postId ? dispatch(getPost({postId})) : dispatch(getAllPost());
        })
        socket.on('messageFrom', (data) => {
            setShowComment({show: false, data: {}});
            setComment('');
            postId ? dispatch(getPost({postId})) : dispatch(getAllPost());
        })
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (id) {
            let loginUserPost = posts?.filter((ele) => ele?.createdBy === id);
            setBlog([...loginUserPost])
        } else if (posts && posts.length) {
            setBlog([...posts]);
        } else {
            setBlog([]);
        }
        // eslint-disable-next-line
    }, [posts, id, postResult, postId])

    useEffect(() => {
        if (postId) {
            dispatch(getPost({postId}))
        } else {
            dispatch(getAllPost());
        }
    }, [postId, postResult]);

    const handleCreateLike = (id) => {
        dispatch(createLike({"postId": id, "likeBy": userToken?._id, isSinglePost: postId}))
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
    const handleShowLikes = (e, likes) => {
        e.stopPropagation();
        dispatch(getAllLikes(likes));
        setShowLike(true);
    }
    const handleAddComment = (data) => {
        dispatch(getCommentsById(data?._id))
        setShowComment({show: true, data: data});
    }
    const handleSaveComment = () => {
        socket.emit('commentNotification', {
            content: comment,
            id: showComment?.data?.createdBy,
            createdBy: userToken?._id,
            postId: showComment?.data?._id,
            userName: userToken?.userName
        })
        setShowComment({show: false, data: {}});
        setComment('');
    }
    const handleOnChange = (e) => {
        setComment(e.target.value)
    }
    const handleOnShare = (item) => {
        setSharePost({show: true, data: item})
    }
    const handleDeletePost = (data) => {
        dispatch(deletePost({_id: data?._id}))
        setOpen({show: false, postId: ''})
    }
    const handleUpdatePost = (data) => {
        navigate('/edit-post', {state: data});
        setOpen({show: false, postId: ''})
    }
    console.log("postResult", postResult)
    return (
        <>
            {loading ? <Loader/> :
                <div className='relative lg:overflow-y-scroll lg:h-[80vh]   '>
                    {blog.length > 0 ? blog?.map((ele, index) => (
                        <div className="" key={index}>
                            {id && userToken._id === id && ele?._id === open?.postId &&
                            <div ref={blockRef}
                                 className={`absolute right-11 z-10 mt-8 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!open.show ? 'hidden' : ''}`}
                                 role="menu"
                                 aria-orientation="vertical"
                                 aria-labelledby="user-menu-button"
                                 tabIndex="-1">
                                <ul className="space-y-2">
                                    <li>
                                        <div onClick={() => handleUpdatePost(ele)}
                                             className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MdModeEditOutline/>
                                            <span className="ml-3">Update</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div onClick={() => handleDeletePost(ele)}
                                             className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MdDelete/>
                                            <span className="ml-3">Delete</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>}
                            <div className='flex items-center justify-center w-full p-2 '>
                                <div className="border p-5 bg-white w-full shadow-lg shadow-gray-400  shadow">
                                    <div className="flex w-full items-center  justify-between border-b pb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="">
                                                <img className="h-8 w-8 rounded-full bg-slate-400 object-cover"
                                                     src={ele?.author_info[0]?.profile_url ? ele?.author_info[0]?.profile_url.includes('https') ? ele?.author_info[0]?.profile_url : `${url}/${ele?.author_info[0]?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                     alt=""/>
                                            </div>
                                            {/*<div className="h-8 w-8 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]"></div>*/}
                                            <div className='text-lg font-bold text-slate-700font-bold cursor-pointer'
                                                 onClick={(e) => handleProfile(e, ele?.createdBy)}>
                                                {ele?.author_info[0]?.userName}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-8">
                                            <div className="text-xs text-neutral-500 flex items-center">
                                                <BsDot/> {handleDate(ele?.createdAt)}</div>
                                            {id && userToken._id === id &&
                                            <BsThreeDotsVertical className="pointer" onClick={() => setOpen({
                                                show: !open?.show,
                                                postId: ele?._id
                                            })}/>}
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:px-6 ">
                                        <div className="mb-3 text-xl font-bold">{ele?.title}</div>
                                        <div
                                            className="text-sm text-neutral-600">{ele?.content}</div>
                                        {ele?.imageUrl && <img src={`${url}${ele?.imageUrl}`} alt=''
                                                               className="lg:h-[350px] w-full object-fill py-2"/>}

                                    </div>
                                    <div>
                                        <div className="sm:px-6 pt-4 pb-2">
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
                                                        onClick={(e) => handleShowLikes(e, ele?.likes)}>{ele?.likes.length} likes</span>
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
                                        </div>
                                        <div className='ml-3 mb-2'>
                                            # post from <span className='ml-1 text-[#79CCF4]'>{ele?.device}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)) : <>
                        <div className="h-[500px] pl-2">
                            <div
                                className="bg-white h-full rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex justify-end px-4 pt-4">
                                    <div className="border-t border-gray-200 text-center pt-14">
                                        <h1 className="text-9xl font-bold text-pink-400">No Posts</h1>
                                        <p className="text-2xl pb-8 px-12 font-medium">Oops! The post you are looking
                                            for does not exist. Press the button and create the post.</p>
                                        <button onClick={() => navigate('/post')}
                                                className="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6">
                                            Post Create
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>}
                </div>}
            {/*share modal*/}
            <>
                {sharePost.show && <div class="relative z-10">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div class="fixed inset-0 z-10 overflow-y-auto"
                         onClick={() => setSharePost({show: false, data: null})}>
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                            <div
                                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div class="sm:flex sm:items-start border-b border-gray-200 py-3 justify-between">
                                        <div className="flex ">
                                            <div
                                                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <FaShareAlt color={'#e97d1e'} size={20}/>
                                            </div>
                                            <div
                                                className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex justify-between items-center">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900 "
                                                    id="modal-title">Share Modal</h3>
                                            </div>
                                        </div>
                                        <div
                                            className="text-sm font-medium  hover:underline dark:text-blue-500"
                                            onClick={() => setSharePost({show: false, data: null})}>
                                            <FaWindowClose size={25}/>
                                        </div>
                                    </div>

                                    <p className="text-sm my-2">Share this link via</p>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                                        <div className="w-full flex justify-around">
                                            <a href={`whatsapp://send?text=${appUrl}/post/${sharePost?.data ? sharePost?.data?.author_info[0]?.userName : 'postById'}/${sharePost?.data?._id}`}
                                               data-action="share/whatsapp/share"
                                               target="_blank"> <FaWhatsappSquare color={'#25D366'} size={60}/></a>
                                            <a href={`https://www.facebook.com/sharer.php?u=${appUrl}/post/${sharePost?.data ? sharePost?.data?.author_info[0]?.userName : 'postById'}/${sharePost?.data?._id}`}
                                               data-action="share/whatsapp/share"
                                               target="_blank"> <FaFacebookSquare color={'#4267B2'} size={60}/></a>
                                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}/post/${sharePost?.data ? sharePost?.data?.author_info[0]?.userName : 'postById'}/${sharePost?.data?._id}`}
                                               data-action="share/whatsapp/share"
                                               target="_blank"> <FaLinkedin color={'#0077B5'} size={60}/></a>
                                        </div>
                                    </div>
                                    <p className="text-sm my-2">Or copy link</p>

                                    <div
                                        className="border-2 border-gray-200 flex justify-between items-center mt-4 py-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            className="fill-gray-500 ml-2"
                                        >
                                            <path
                                                d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"
                                            ></path>
                                            <path
                                                d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"
                                            ></path>
                                        </svg>

                                        <input className="w-full outline-none bg-transparent" type="text"
                                               placeholder="link" value={`${appUrl}/post`}/>

                                        <button onClick={() => {
                                            navigator.clipboard.writeText(`${appUrl}/post/${sharePost?.data ? sharePost?.data?.author_info[0]?.userName : 'postById'}/${sharePost?.data?._id}`);
                                        }}
                                                className="bg-indigo-500 text-white rounded text-sm py-2 px-5 mr-2 hover:bg-indigo-600">
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </>
            <Modal
                isOpen={showLike}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="max-w-2xl mx-auto ">

                    <div
                        className="p-4 max-w-md bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white"
                                ref={(_subtitle) => (subtitle = _subtitle)}>Likes</h3>
                            <div
                                className="text-sm font-medium  hover:underline dark:text-blue-500"
                                onClick={closeModal}>
                                <FaWindowClose size={25}/>
                            </div>
                        </div>
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
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={showComment?.show}
                onAfterOpen={afterOpenModal}
                onRequestClose={() => setShowComment({show: false, id: ''})}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <div className="max-w-2xl mx-auto ">
                        <div
                            className="p-4 max-w-md bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white"
                                    ref={(_subtitle) => (subtitle = _subtitle)}>Comments</h3>
                                <div
                                    className="text-sm font-medium  hover:underline dark:text-blue-500"
                                    onClick={() => setShowComment({show: false, id: ''})}>
                                    <FaWindowClose size={25}/>
                                </div>
                            </div>
                            <div className="flow-root h-[250px] overflow-y-scroll">
                                <ul role="presentation" className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {comments && comments?.length ? comments?.map((ele, index) => {
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
                            <div className="w-full flex">
                                Share this post via
                                <a href={`whatsapp://send?text=${appUrl}/post/${showComment?.data ? showComment?.data?.author_info[0]?.userName : 'postById'}/${showComment?.data?._id}`}
                                   data-action="share/whatsapp/share"
                                   target="_blank"> <FaWhatsappSquare color={'#25D366'} size={32}/></a>
                                <a href={`https://www.facebook.com/sharer.php?u=${appUrl}/post/${showComment?.data ? showComment?.data?.author_info[0]?.userName : 'postById'}/${showComment?.data?._id}`}
                                   data-action="share/whatsapp/share"
                                   target="_blank"> <FaFacebookSquare color={'#4267B2'} size={32}/></a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}/post/${showComment?.data ? showComment?.data?.author_info[0]?.userName : 'postById'}/${showComment?.data?._id}`}
                                   data-action="share/whatsapp/share"
                                   target="_blank"> <FaLinkedin color={'#0077B5'} size={32}/></a>
                            </div>
                        </div>

                    </div>

                </div>
            </Modal>
        </>
    )
};

export default BlogPage;
