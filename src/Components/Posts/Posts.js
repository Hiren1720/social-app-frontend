import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsHandThumbsUp,BsHandThumbsUpFill, BsShare,BsDot} from 'react-icons/bs';
import {TfiComment} from 'react-icons/tfi';
import {useDispatch, useSelector} from "react-redux";
import {toast} from 'react-toastify';
import {createLike, getAllLikes, getAllPost} from "../../Actions/postActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import Modal from 'react-modal';
import {getCommentsById} from "../../Actions/commentAction";
import ButtonLoader from "../ButtonLoader";
import useWidthHeight from "../../Hooks/useWidthHeight";
import {url} from '../../Helper/constants';

Modal.setAppElement('#modal')

const BlogPage = ({socket}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userToken = getTokenObject();
    const {width} = useWidthHeight();
    const posts = useSelector(state => state.postData.posts);
    const likes = useSelector(state => state.postData.likes);
    const comments = useSelector(state => state.postData.comments);
    const loading = useSelector(state => state.postData.loading);
    const likeLoading = useSelector(state => state.postData.likeLoading);
    const commentLoading = useSelector(state => state.postData.commentLoading);
    const [blog, setBlog] = useState([]);
    const [showLike, setShowLike] = useState(false);
    const [showComment, setShowComment] = useState({show:false,data:{}});
    const [comment, setComment] = useState('');
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

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setShowLike(false);
    }
    useEffect(()=>{
        socket.on('message',(data)=>{
            toast(data?.text,{type:'success'});
            new Notification(data?.text)
            setShowComment({show:false,data:{}});
            setComment('');
            dispatch(getAllPost());
        })
        socket.on('messageFrom',(data)=>{
            setShowComment({show:false,data:{}});
            setComment('');
            dispatch(getAllPost());
        })
        // eslint-disable-next-line
    },[])
    useEffect(()=>{
        if(posts && posts.length){
            setBlog([...posts]);
        }
        else {
            setBlog([]);
        }
        // eslint-disable-next-line
    },[posts])
    useEffect(()=> {
        dispatch(getAllPost());
        // eslint-disable-next-line
    },[]);
    const handleCreateLike = (id) => {
        dispatch(createLike({ "postId":id, "likeBy":userToken?._id}))
    }
    const handleProfile = (e,userId) => {
        navigate(`/profile/${userId}`)
    };
    const handleDate = (date) => {
        let postDate = new Date(date);
        let today = new Date();
        let days = today.getDate() - postDate.getDate();
        if((today.getMonth() === postDate.getMonth()) && days < 16){
            return days === 0 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago';
        }
        else {
            return `${postDate.getDate()} ${postDate.toLocaleString('default', { month: 'long' })} ${postDate.getFullYear()}`;
        }
    };
    const handleShowLikes = (e,likes) => {
        e.stopPropagation();
        dispatch(getAllLikes(likes));
        setShowLike(true);
    }
    const handleAddComment = (data) => {
        dispatch(getCommentsById(data?._id))
        setShowComment({show:true,data:data});
    }
    const handleSaveComment = () => {
        socket.emit('commentNotification',{content:comment,id:showComment?.data?.createdBy,createdBy:userToken?._id,postId:showComment?.data?._id,userName:userToken?.userName})
        setShowComment({show:false,data:{}});
        setComment('');
    }
    const handleOnChange = (e) => {
        setComment(e.target.value)
    }
    return (
        <>
            {loading ? <Loader/>:
            <div className=''>
                {blog.map((ele,index) => (
                    <div className="flex mx-[150px] my-10 max-[890px]:mx-[100px] max-[690px]:mx-[80px] max-[649px]:mx-[30px] max-[380px]:mx-[20px] rounded overflow-hidden border-[grey] border-[2px] shadow-lg" key={index}>
                        <div className='w-full'>
                            <div className='flex items-center mt-2 ml-2'>
                                <div className="">
                                    <img className="h-10 w-10 rounded-full"
                                         src={ele?.author_info[0]?.profile_url ? `${url}/${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                         alt=""/>
                                </div>
                                <div className="ml-4">
                                    <div
                                        className="w-full mb-0 relative text-gray-600 focus-within:text-gray-400">
                                        <div className='text-black font-bold cursor-pointer' onClick={(e)=> handleProfile(e,ele?.createdBy)}>
                                            {ele?.author_info[0]?.userName}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex text-gray-500 items-center justify-end'>
                                    <BsDot/> {handleDate(ele?.createdAt)}
                                </div>
                            </div>
                            <div className='mt-2 hidden'>
                                <img className="" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Sunset in the mountains"/>
                            </div>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{ele?.title}</div>
                                <p className="text-gray-700 text-base">
                                    {ele?.content}
                                </p>
                                {ele?.imageUrl ? <img src={`${url}${ele?.imageUrl}`} height='300' width='300'/> :''}
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                {ele?.mentions?.length ? ele.mentions.map((mention,id) => (<span key={id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{mention?.name}</span>)):null}
                            </div>
                            <div className="flex items-center text-gray-500 mb-3 flex-wrap max-[560px]:text-[14px] max-[589px]:text-[15px]">
                                <div className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer" onClick={()=> handleCreateLike(ele?._id)}>{ele?.likes.includes(userToken?._id) ? <BsHandThumbsUpFill color='#3C5AF0'/>:<BsHandThumbsUp color='#3C5AF0'/>}&nbsp;&nbsp;<span onClick={(e)=> handleShowLikes(e,ele?.likes)}>{ele?.likes.length} likes</span></div>
                                <div className="flex mx-4 max-[550px]:mx-3 items-center font-bold cursor-pointer" onClick={()=> handleAddComment(ele)}><TfiComment/>&nbsp;&nbsp;{ele?.comments.length} comments</div>
                                <div className="flex mx-4 max-[550px]:mx-3 items-center font-bold"><BsShare/>&nbsp;&nbsp;share</div>
                            </div>
                            <div className='ml-3 mb-2'>
                                # post from <span className='ml-1 text-[#79CCF4]'>{ele?.device}</span>
                            </div>
                        </div>
                    </div>))}
            </div>}
            <Modal
                isOpen={showLike}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Likes</h2>
                {likeLoading ? <ButtonLoader/>:<div>
                    {likes && likes?.length && likes?.map((ele,index)=> {
                        return (
                            <div key={index} className='flex items-center mt-2 ml-2'>
                                <div className="">
                                    <img className="h-5 w-5 rounded-full"
                                         src={ele?.profile_url ? `${url}/${ele?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                         alt=""/>
                                </div>
                                <div className='ml-4 cursor-pointer' onClick={(e)=> handleProfile(e,ele?._id)}>{ele?.userName}</div>
                            </div>
                        )
                    })}
                </div>}
                <div className='flex justify-end'>
                    <button onClick={closeModal}>Close</button>
                </div>
            </Modal>
            <Modal
                isOpen={showComment?.show}
                onAfterOpen={afterOpenModal}
                onRequestClose={()=> setShowComment({show:false,id:''})}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Comments</h2    >
                <div>
                    {comments && comments?.length ? comments?.map((ele,index)=> {
                        return (
                            <div key={index} className='flex items-center mt-2 ml-2'>
                                <div className="">
                                    <img className="h-5 w-5 rounded-full"
                                         src={ele?.author_info[0]?.profile_url ? `${url}/${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                         alt=""/>
                                </div>
                                <div className='ml-2 cursor-pointer' onClick={(e)=> handleProfile(e,ele?.createdBy)}>{ele?.author_info[0]?.userName}:<span className='font-bold'>{ele?.content}</span></div>
                            </div>
                        )
                    }):
                        <div>No Comments</div>
                    }
                </div>
                <div className='mt-3'>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="comment" type="text" placeholder="Comment" name={"comment"}
                        value={comment}
                        onChange={(e) => handleOnChange(e)}/>
                </div>
                <div className='flex justify-end mt-2'>
                    <button
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" onClick={handleSaveComment} disabled={commentLoading || comment === ''}>
                        {commentLoading ? <ButtonLoader/> : "Comment"}
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=> setShowComment({show:false,id:''})}>Close</button>
                </div>
            </Modal>
        </>
    )
};

export default BlogPage;