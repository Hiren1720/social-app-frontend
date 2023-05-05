import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {BsHandThumbsUp,BsHandThumbsUpFill, BsShare,BsDot} from 'react-icons/bs';
import {TfiComment} from 'react-icons/tfi';
import {useDispatch, useSelector} from "react-redux";
import {toast} from 'react-toastify';
import {createLike, getAllLikes, getAllPost} from "../../Actions/postActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import Modal from 'react-modal';
import {getCommentsById} from "../../Actions/commentAction";
import ButtonLoader from "../ButtonLoader";
import useWidthHeight from "../../Hooks/useWidthHeight";
import {url} from '../../Helper/constants';
import '../User/User.css';
import {FaWindowClose} from 'react-icons/fa';
Modal.setAppElement('#modal')

const BlogPage = ({socket}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let userToken = getLocalStorageData('user');
    const {width} = useWidthHeight();
    const {id} = useParams();
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
    const bgColor = ['blue-500', 'red-500', 'pink-400', 'gray-300' ];
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
        if(id){
            let loginUserPost = posts?.filter((ele)=>{
                return ele?.createdBy == id;
            });
            setBlog([...loginUserPost])
        }
        else if(posts && posts.length){
            setBlog([...posts]);
        }
        else {
            setBlog([]);
        }
    },[posts, id])

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
            return days === 0 ? 'today' : days === 1 ? 'yesterday' : days +' days ago';
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
                <div className='relative lg:overflow-y-scroll 2xl:h-screen '>
                    {blog?.map((ele,index) => (
                        <div className="" key={index}>
                            <div className='flex items-center justify-center w-full p-2 '>
                                <div className="border p-5 bg-white w-full shadow-lg shadow-gray-400  shadow">
                                    <div className="flex w-full items-center  justify-between border-b pb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="">
                                                <img className="h-8 w-8 rounded-full bg-slate-400 object-cover"
                                                     src={ele?.author_info[0]?.profile_url ? `${url}/${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                     alt=""/>
                                            </div>
                                            {/*<div className="h-8 w-8 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]"></div>*/}
                                            <div className='text-lg font-bold text-slate-700font-bold cursor-pointer' onClick={(e)=> handleProfile(e,ele?.createdBy)}>
                                                {ele?.author_info[0]?.userName}
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-8" >
                                            {/*<button class="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">Category</button>*/}
                                            <div class="text-xs text-neutral-500 flex items-center"><BsDot/> {handleDate(ele?.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:px-6 ">
                                        <div className="mb-3 text-xl font-bold">{ele?.title}</div>
                                        <div
                                            className="text-sm text-neutral-600">{ele?.content}</div>
                                        {ele?.imageUrl && <img src={`${url}${ele?.imageUrl}`} className="lg:h-[350px] w-full object-fill py-2"/>}
                                        {/*<img src={} alt="image"/>*/}

                                    </div>
                                    <div>
                                        <div className="sm:px-6 pt-4 pb-2">
                                            {ele?.mentions?.length ? ele.mentions.map((mention, id) => (
                                                <span key={id}
                                                      className={`inline-block bg-${bgColor?.length > id ? bgColor[id]: bgColor.slice(-id+5)[0]} rounded-full px-3 py-1 text-sm font-semibold  mr-2 mb-2`}
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
                                                        <TfiComment/>&nbsp;&nbsp;{ele?.comments.length} comments</div>
                                                    <div
                                                        className="flex mx-4 max-[550px]:mx-3 items-center font-bold">
                                                        <BsShare/>&nbsp;&nbsp;share</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='ml-3 mb-2'>
                                            # post from <span className='ml-1 text-[#79CCF4]'>{ele?.device}</span>
                                        </div>
                                    </div>
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
                <div className="max-w-2xl mx-auto ">

                    <div
                        className="p-4 max-w-md bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white" ref={(_subtitle) => (subtitle = _subtitle)}>Likes</h3>
                            <div
                                className="text-sm font-medium  hover:underline dark:text-blue-500" onClick={closeModal}>
                                <FaWindowClose size={25}/>
                            </div>
                        </div>
                        <div className="flow-root h-[250px] overflow-y-scroll">
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {likeLoading ? <ButtonLoader/>:<div>
                                    {likes && likes?.length && likes?.map((ele,index)=> {
                                        return (<>
                                                <li className="py-3 sm:py-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <img className="h-8 w-8 rounded-full object-cover"
                                                                 src={ele?.profile_url ? `${url}/${ele?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                 alt=""/>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white" onClick={(e)=> handleProfile(e,ele?._id)}>
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
                onRequestClose={()=> setShowComment({show:false,id:''})}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <div className="max-w-2xl mx-auto ">

                        <div
                            className="p-4 max-w-md bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white" ref={(_subtitle) => (subtitle = _subtitle)}>Comments</h3>
                                <div
                                    className="text-sm font-medium  hover:underline dark:text-blue-500" onClick={()=> setShowComment({show:false,id:''})}>
                                    <FaWindowClose size={25}/>
                                </div>
                            </div>
                            <div className="flow-root h-[250px] overflow-y-scroll">
                                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {comments && comments?.length ? comments?.map((ele,index)=> {
                                            return (<>
                                                    <li className="py-3 sm:py-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex-shrink-0">
                                                                <img className="h-8 w-8 rounded-full object-cover"
                                                                     src={ele?.author_info[0]?.profile_url ? `${url}/${ele?.author_info[0]?.profile_url}`:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                     alt=""/>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white" onClick={(e)=> handleProfile(e,ele?.createdBy)} >
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
                                        }):
                                        <div>No Comments</div>
                                    }
                                </ul>
                            </div>
                            <div className="relative w-full">
                                <input className="bg-gray-100 rounded-[40px] shadow-inner  shadow-gray-700 leading-normal resize-none w-full h-15 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                       id="comment" type="text" placeholder="Comment" name={"comment"}
                                       value={comment}
                                       onChange={(e) => handleOnChange(e)}
                                />
                                <button
                                    className="text-white absolute w-[25%] rounded-[40px] right-0.5 p-[8px] m-0 bottom-0.5 bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none  font-medium text-sm "
                                    onClick={handleSaveComment} disabled={commentLoading || comment === ''}
                                >{commentLoading ? <ButtonLoader/> : "Send"}</button>
                            </div>
                        </div>

                    </div>

                </div>




















            </Modal>
        </>
    )
};

export default BlogPage;
