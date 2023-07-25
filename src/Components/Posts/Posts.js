import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    BsBookmark,
    BsCamera,
} from 'react-icons/bs';
import {useDispatch, useSelector} from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {toast} from 'react-toastify';
import {getPost} from "../../Actions/postActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import Loader from "../Layouts/Loader";
import Modal from 'react-modal';
import ButtonLoader from "../ButtonLoader";
import '../User/User.css';
import ProfilePhoto from "../User/ProfilePhoto";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../Common/Post";

Modal.setAppElement('#modal');

const BlogPage = ({socket, type,id}) => {
    let userToken = getLocalStorageData('user');
    const [blog,setBlog] = useState([]);
    const posts = useSelector(state => state.postData.posts);
    const loading = useSelector(state => state.postData.loading);
    const [modal, setModal] = useState({open: false, data: null, title: null});
    const [page, setPage] = useState(0);
    let pageSize = 10;
    const total = useSelector(state => state.postData.total);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function closeModal() {
        setModal({open: false, data: null, title: null});
    }

    useEffect(() => {
        socket.on('message', (data) => {
            toast(data?.text, {type: 'success'});
            let options = {
                body: data?.text,
                icon: require("../../assets/images/favicon.png"),//https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg
                dir: "ltr"
            };
            new Notification('Social App Notification', options)
            setModal({open: false, data: null, title: null});
            // receivePosts()
            // let newPosts = blog.map(ele => {
            //     console.log(ele?.id,data?.postId)
            //     if(ele?._id === data?.postId){
            //         console.log('ele',data)
            //     }
            // })
        })
        socket.on('messageFrom', (data) => {
            setModal({open: false, data: null, title: null});
            // console.log('ele',[...blog])
            // let newPosts = blog.map(ele => {
            //     if(ele?._id === data?.postId){
            //     }
            // })
            // receivePosts()
        })
        // eslint-disable-next-line
    }, []);
    useEffect(()=>{
        if(posts?.length){
            setBlog([...blog,...posts])
        }
        else {
            setBlog([]);
        }
    },[posts, id, type]);
    useEffect(() =>{
        if (page !== 0) {
            setPage(0);
        }
        setBlog([]);
        receivePosts(page !== 0);
        // eslint-disable-next-line
    }, [id, type]);
    const receivePosts =(isFirstPage) => {
        if (id) {
            dispatch(getPost({id:id,type,page:isFirstPage ?0:page,pageSize}))
        }
        else {
            dispatch(getPost({type,page:isFirstPage?0:page,pageSize}));
        }
        setPage(pre => pre + 1);
    };
    return (
        <>
            {loading ? <Loader/> :
                <div className='relative lg:overflow-y-scroll '>
                    {blog?.length > 0 ? <InfiniteScroll
                        dataLength={blog?.length}
                        next={receivePosts}
                        hasMore={blog.length !== total}
                        loader={<ButtonLoader/>}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >{blog?.map((ele, index) => (
                        <Post key={index} item={ele} type={type} userData={userToken} id={id} socket={socket}/>
                    ))}</InfiniteScroll> : <>
                        <div className="max-h-[400px] pl-2 items-center">
                            <div
                                className="bg-white h-full rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 py-10">
                                {type === 'getSavedPosts' ? <>
                                        <div className="flex justify-center px-4 py-8">
                                            <div className="border-black text-center border-[4px]  rounded-full md:p-8 p-4">
                                                <BsBookmark size={80} className="p-2"/>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <h1 className="md:text-6xl text-4xl font-bold text-black pb-4 ">Start Saving</h1>
                                            <div className='text-gray-600 text-semibold mb-2'>Save photos and videos to your
                                                All Posts collection.
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className="flex justify-center px-4 py-8">
                                            <div className="border-black text-center border-[4px]  rounded-full md:p-8 p-4">
                                                <BsCamera size={80} className="p-2"/>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <h1 className="md:text-6xl text-4xl font-bold text-black pb-4 ">Share Posts</h1>
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
            <ProfilePhoto open={modal.open} closeModal={closeModal} imageUrl={modal?.data || ''}/>
        </>
    )
};

export default BlogPage;
