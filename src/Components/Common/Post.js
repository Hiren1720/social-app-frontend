import React, {useEffect, useRef, useState} from 'react';
import Slider from "react-slick";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FaFacebookSquare, FaLinkedin, FaWhatsappSquare, FaWindowClose, FaRegComment} from "react-icons/fa";
import {MdArrowBackIosNew, MdArrowForwardIos, MdDelete, MdModeEditOutline} from "react-icons/md";
import {IoMdLink} from "react-icons/io";
import {TfiComment} from 'react-icons/tfi';
import {
    BsBookmark,
    BsBookmarkFill,
    BsDot,
    BsHandThumbsUp,
    BsHandThumbsUpFill,
    BsLink45Deg,
    BsShare,
    BsThreeDotsVertical,
    BsHeartFill
} from 'react-icons/bs';
import {createLike, deletePost, getAllLikes, getPost} from "../../Actions/postActions";
import {savePost} from "../../Actions/userActions";
import Modal from "react-modal";
import ProfilePhoto from "../User/ProfilePhoto";
import ButtonLoader from "../ButtonLoader";
import {toast} from "react-toastify";
import useWidthHeight from "../../Hooks/useWidthHeight";
import {createComment} from "../../Actions/commentAction";
import {ssEvents, channel} from "../../SSE/sse";

const url = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;
const Post = ({item, userData, type, key, id, handleUpdateComment}) => {
    const comments = useSelector(state => state.postData.comments);
    const commentLoading = useSelector(state => state.postData.commentLoading);
    const likes = useSelector(state => state.postData.likes);
    const likeLoading = useSelector(state => state.postData.likeLoading);
    const [modal, setModal] = useState({open: false, data: null, title: null});
    const [open, setOpen] = useState({show: false, postId: ''});
    const [showContent, setShowContent] = useState({show: false, postId: ''});
    const [comment, setComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const blockRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {width} = useWidthHeight();
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


    useEffect(() => {
        ssEvents.addEventListener(`comment`, function (e) {
            let data = JSON.parse(e.data)
            if (item?._id === data?.postId) {
                handleUpdateComment(data, 'comments');
            }
        }, false);
        channel.subscribe('liked', (data) => {
            handleUpdateComment({likes: data?.data?.likes, postId: data?.data?._id}, 'likes');
            if (data?.data?.likeBy !== userData?._id && data?.data?.createdBy === userData?._id && data?.data?.isLiked) {
                let options = {
                    body: `${data?.data?.userName} is liked your post.`,
                    icon: require("../../assets/images/favicon.png"),
                    dir: "ltr"
                };
                toast.success(`${data?.data?.userName} is liked your post.`);
                new Notification('Social App Notification', options);
            }
        })
        // ssEvents.addEventListener(`likes`, function (e) {
        //     let data =JSON.parse(e.data)
        //     handleUpdateComment({likes:data?.likes,postId:data?._id},'likes');
        // }, false);
    }, []);

    function closeModal() {
        setModal({open: false, data: null, title: null});
    }

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    const handleCreateLike = ({_id, createdBy}) => {
        let data = {
            id: createdBy,
            likeBy: userData?._id,
            postId: _id,
            userName: userData?.userName,
            isSinglePost: type === 'getPost',
            type
        };
        // channel.publish("like", data);
        dispatch(createLike(data))
    };

    const handleSavePost = (id) => {
        dispatch(savePost({id: id}))
    };
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
    };
    const handleAddComment = (data) => {
        dispatch(getAllLikes({id: data?._id, type: 'comments'}));
        setModal({open: true, data: data, title: 'Comments'});
    };
    const handleSaveComment = () => {
        let data = {
            content: comment,
            id: modal?.data?.createdBy,
            createdBy: userData?._id,
            postId: modal?.data?._id,
            userName: userData?.userName
        };
        dispatch(createComment(data));
        setModal({open: false, data: null, title: null});
        setComment('');
    };
    const handleOnChange = (e) => {
        setComment(e.target.value)
    };
    const handleOnShare = (item) => {
        setModal({open: true, data: item, title: 'Share'})
    };
    const handleDeletePost = () => {
        setModal({open: false, data: null, title: null});
        dispatch(deletePost({_id: modal?.data?._id}));
        setOpen({show: false, postId: ''})
    };
    const handleUpdatePost = (data) => {
        navigate('/edit-post', {state: data});
        setOpen({show: false, postId: ''})
    };
    const renderLikeModal = () => (
        <div className="flow-root h-[250px] overflow-y-scroll">
            <ul role="presentation" className="divide-y divide-gray-200 dark:divide-gray-700">
                {likeLoading ? <ButtonLoader/> : <div>
                    {likes && likes?.length && likes?.map((ele, index) => {
                        return (
                            <li className="py-3 sm:py-4" key={index}>
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
                        )
                    })}
                </div>}
            </ul>
        </div>
    );
    const renderCommentModal = () => (
        <>
            <div className="flow-root h-[250px] overflow-y-scroll">
                <ul role="presentation" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {comments?.length ? comments?.map((ele, index) => {
                            return (
                                <li className="py-3 sm:py-4" key={index}>
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
    );
    const renderShareModal = () => {
        let url = `${appUrl}/post/${(modal?.data && modal?.data?.author_info) ? modal?.data?.author_info[0]?.userName : 'postById'}/${modal?.data?._id}`
        return (
            <>
                <p className="text-sm my-2">Share this link via</p>
                <Slider {...settings} >
                    {Array.isArray(modal?.data?.imageUrl) ? (
                        modal?.data?.imageUrl?.map((file, index) => generateCommonStructure(file, index))
                    ) : (
                        generateCommonStructure(modal?.data?.imageUrl, 0)
                    )}
                </Slider>
                <div className="mt-5  text-center sm:ml-4  sm:text-left">
                    <div className="w-full flex justify-around">
                        <a href={`whatsapp://send?text=${url}`}
                           data-action="share/whatsapp/share" rel="noreferrer"
                           target="_blank"> <FaWhatsappSquare color={'#25D366'} size={60}/></a>
                        <a href={`https://www.facebook.com/sharer.php?u=${url}`}
                           data-action="share/facebook/share" rel="noreferrer"
                           target="_blank"> <FaFacebookSquare color={'#4267B2'} size={60}/></a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
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
    };
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
    };

    const generateCommonStructure = (file, index) => {
        const fileExtension = file?.secure_url?.split('.').pop().toLowerCase();
        const isVideo = fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg';

        return (
            <div className='relative' key={index}>
                {file?.secure_url?.length > 0 ? isVideo ? (
                    <video src={file?.secure_url} autoPlay controls={true}
                           className=" h-[350px] w-full object-fill py-2 rounded-2xl"/>
                ) : (
                    <img src={file?.secure_url} alt='post' className="h-[350px] w-full object-fill py-2 rounded-2xl"/>
                ) : ''}

            </div>
        );
    }
    return (
        <>
            <div key={key}>
                {id && userData._id === id && item?._id === open?.postId &&
                <div ref={blockRef}
                     className={`absolute right-11 z-10 mt-8 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${!open.show ? 'hidden' : ''}`}
                     role="menu"
                     aria-orientation="vertical"
                     aria-labelledby="user-menu-button"
                     tabIndex="-1">
                    <ul className="space-y-2">
                        <li className='cursor-pointer'>
                            <div onClick={() => handleUpdatePost(item)}
                                 className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <MdModeEditOutline/>
                                <span className="ml-3">Update</span>
                            </div>
                        </li>
                        <li className='cursor-pointer'>
                            <div onClick={() => {
                                setModal({open: true, data: item, title: 'Delete'});
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
                    <div className=" px-5 pt-5 pb-2 bg-white w-full shadow-lg shadow-gray-400 rounded-2xl border">
                        <div className="flex w-full items-center  justify-between border-b pb-3">
                            <div className="flex items-center space-x-3">
                                <div className="" onClick={() => setModal({
                                    open: true,
                                    title: 'Profile',
                                    data: item?.author_info[0]?.profile_url
                                })}>
                                    <img className="h-8 w-8 rounded-full bg-slate-400 object-cover"
                                         src={item?.author_info[0]?.profile_url ? item?.author_info[0]?.profile_url.includes('https') ? item?.author_info[0]?.profile_url : `${url}/${item?.author_info[0]?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                         alt=""/>
                                </div>
                                <div className='text-lg font-bold text-slate-700font-bold cursor-pointer'
                                     onClick={(e) => handleProfile(e, item?.createdBy)}>
                                    {item?.author_info[0]?.userName}
                                </div>
                            </div>
                            <div className="flex items-center space-x-8">
                                <div className="text-xs text-neutral-500 flex items-center">
                                    <BsDot/> {handleDate(item?.createdAt)}</div>
                                {id && userData._id === id && type === 'getPostsByUserId' &&
                                <BsThreeDotsVertical className="pointer cursor-pointer"
                                                     onClick={() => setOpen({
                                                         show: !open?.show,
                                                         postId: item?._id
                                                     })}/>}
                            </div>
                        </div>
                        <div className=" sm:px-6 relative">
                            <div className="mb-1 text-xl font-bold">{item?.title}</div>
                            <div
                                className="text-sm text-neutral-600">{item?.content?.length > 120 ? item?.content?.slice(0, showContent?.postId === item?._id && showContent.show ? -1 : 120) : item?.content}
                                &nbsp;<span className="text-sm text-blue-600 font-bold cursor-pointer" onClick={() => {
                                    setShowContent(showContent.show ? {postId: null, show: false} : {
                                        postId: item?._id,
                                        show: !showContent.show
                                    })
                                }}>{showContent?.postId === item?._id && showContent.show ? 'show less' : 'show more'}</span>
                            </div>
                            <Slider {...settings} >
                                {Array.isArray(item?.imageUrl) ? (
                                    item?.imageUrl.map((file, index) => generateCommonStructure(file, index))
                                ) : (
                                    generateCommonStructure(item?.imageUrl, 0)
                                )}
                            </Slider>
                            <div
                                className="flex items-center mt-4 absolute bottom-1 right-2 h-6 w-full justify-end rounded-full p-2 text-xs text-white">
                                <button
                                    className="bg-blue-400 border text-white text-lg flex justify-center items-center h-10 w-10 active:bg-red-600 font-bold uppercase rounded-full shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                                    <FaRegComment/>
                                </button>
                                <button
                                    onClick={() => handleSavePost(item?._id)}
                                    className={` ${item?.savedBy?.includes(userData?._id) ? 'bg-black ' : 'bg-blue-400'} text-white flex border justify-center items-center h-10 w-10 active:bg-red-600 font-bold uppercase rounded-full shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150`}
                                    type="button"
                                >
                                    <BsBookmarkFill/>
                                </button>
                                <button
                                    className={` ${item?.likes.includes(userData?._id) ? 'bg-red-600 text-white' : 'bg-white text-red-500'} flex border justify-center items-center h-10 w-10 active:bg-red-600 font-bold uppercase rounded-full shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150`}
                                    type="button"
                                    onClick={() => handleCreateLike(item)}
                                >
                                    <BsHeartFill/>
                                </button>
                            </div>
                        </div>
                        <div className='sm:px-6 px-0'>
                            {/*<div className="sm:px-6 pt-8 pb-2">*/}
                            {/*    {item?.mentions?.length ? item.mentions.map((mention, id) => (*/}
                            {/*        <span key={id}*/}
                            {/*              className={`inline-block bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2`}*/}
                            {/*              onClick={(e) => handleProfile(e, mention?.id)}>{mention?.name}</span>)) : null}*/}
                            {/*</div>*/}
                            <div className='flex justify-between'>
                                <div className=" w-full  rounded-lg flex gap-2 items-center lg:overflow-visible">
                                    <div className="flex items-center -space-x-4">
                                        {item?.likedData?.map((avatar) => (<abbr title={avatar?.userName}><img
                                            alt={avatar?.userName}
                                            src={avatar?.profile_url}
                                            className="relative inline-block h-10 w-10 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10"
                                        /></abbr>))}
                                    </div>
                                   <div className='flex flex-col'>
                                       <div className='text-sm text-gray-800 '>{item?.likedData[item?.likedData?.length-1]?.userName}{ item?.likedData?.length >= 2 && ',' + " "+ item?.likedData[item?.likedData?.length-2]?.userName}</div>
                                       {item?.likes.length > 5 && <div className='text-sm text-gray-900 '>and {item?.likes.length -5} more </div>}
                                       <div className='text-sm text-gray-900 '>liked this</div>
                                   </div>
                                </div>
                                <div
                                    className="flex items-center justify-between text-slate-500">
                                    <div className="flex space-x-4 md:space-x-8">
                                        <div
                                            className="flex items-center gap-3 text-gray-500  max-[560px]:text-[14px] max-[589px]:text-[18px]">
                                            <div
                                                className="flex items-center font-bold cursor-pointer"
                                                // onClick={() => handleCreateLike(item)}
                                            >
                                                {/*{item?.likes.includes(userData?._id) ?*/}
                                                {/*<BsHandThumbsUpFill color='#3C5AF0'/> :*/}
                                                <BsHandThumbsUp/>
                                                {/*// }*/}
                                                &nbsp;&nbsp;
                                                <span
                                                    onClick={(e) => handleShowLikes(e, item?._id)}>{item?.likes.length} </span>
                                            </div>
                                            <div
                                                className="flex  items-center font-bold cursor-pointer"
                                                onClick={() => handleAddComment(item)}>
                                                <FaRegComment/>&nbsp;&nbsp;{item?.comments.length}
                                            </div>
                                            <div onClick={() => handleOnShare(item)}
                                                 className="flex  items-center font-bold cursor-pointer">
                                                <IoMdLink size={25}/>
                                            </div>
                                            {/*<div onClick={() => handleSavePost(item?._id)}*/}
                                            {/*     className="flex  items-center font-bold cursor-pointer">*/}
                                            {/*    {item?.savedBy?.includes(userData?._id) ? <BsBookmarkFill /> :*/}
                                            {/*        <BsBookmark />*/}
                                            {/*    }*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='ml-3 mb-2'>
                                {/*# post from <span className='ml-1 text-[#79CCF4]'>{item?.device}</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal.title !== 'Profile'? <Modal
                isOpen={modal.open}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="max-w-2xl mx-auto ">
                    <div className="p-4 max-w-md bg-white rounded-lg  dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white"
                                ref={(_subtitle) => (subtitle = _subtitle)}>{modal.title}</h3>
                            <div
                                className="text-sm font-medium cursor-pointer hover:underline dark:text-blue-500"
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
            </Modal>: <ProfilePhoto open={modal.open} closeModal={closeModal} imageUrl={modal?.data || ''}/>}
        </>
    )
};

export default Post;
