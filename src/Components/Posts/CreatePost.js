import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { MentionsInput, Mention } from 'react-mentions'
import {getAllUsers} from "../../Actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {createPost,resetPostResult} from "../../Actions/postActions";
import {getTokenObject} from "../../Helper/TokenHandler";
import {GrFormClose} from 'react-icons/gr';
import getDeviceName from "../../Helper/getDeviceName";

const CreatePost = () => {
    const dispatch = useDispatch();
    let userToken = getTokenObject();
    const device = getDeviceName()
    const users = useSelector(state => state.userData.users);
    const loading = useSelector(state => state.postData.loading);
    const postResult = useSelector(state => state.postData.postResult);
    const [mentionUsers,setMentionUsers] = useState([]);
    const [mentions,setMentions] = useState('');
    const [file, setFile] = useState(null);
    const [importError,setImportError] = useState(null);
    const [post, setPost] = useState({
        content: '',
        title: '',
        imageUrl: '',
        likes: [],
        hashTags: [],
        comments: [],
        mentions:[],
    });
    // const [mentions,setMentions] =  useState('');
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(getAllUsers({searchValue:'',pageSize:100,page:0}))
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (users && users.length) {
            let item = users.map((ele)=>{
                return {id:'@' + ele?.userName,display:'@' + ele?.userName};
            });
            setMentionUsers([...item]);
        }
        // eslint-disable-next-line
    }, [users]);
    useEffect(()=> {
        if(postResult){
            navigate('/');
            dispatch(resetPostResult())
        }
        // eslint-disable-next-line
    },[postResult])
    const handleChange = (e) => {
        let {name, value, checked} = e.target
        if (name === 'hobby') {
            if (checked && !post.hobby.includes(value)) {
                post.hobby.push(value);
                setPost({...post})
            } else {
                let index = post.hobby.indexOf(value)
                post.hobby.splice(index, 1);
                setPost({...post})
            }
        }
        else {
            setPost({...post, [name]: value})
        }
    };
    const handleMentions = (e,data,value) => {
        if(value !== "@"){
            setMentions(e.target.value);
        }
        else {
            setMentions(e.target.value);
        }
    };
    const handleOnImportFile = (fileData) => {
        let extension = fileData[0].name.split('.').pop().replace(' ','');
        if(fileData.length > 1){
            setImportError('Post Only One Image');
        }
        else if(extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png'){
            setImportError('Post Only JPEG,JPG & PNG File');
        }
        else{
            setImportError(null);
            const selectedfile = fileData;
            if (selectedfile.length > 0) {
                const [imageFile] = selectedfile;
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const srcData = fileReader.result;
                    setFile(srcData);
                };
                fileReader.readAsDataURL(imageFile);
            }
            setPost({...post,imageUrl: fileData[0]});
        }
    }
    const handleCreate = async (e) => {
        let mUsers = post?.mentions?.map((ele)=> {
            let user = users.find((item)=> item?.userName === ele)
            return {id:user?._id,name:user?.userName};
        });
        const time = new Date().toISOString();
        let formData = new FormData();
        formData.append('postImage',post?.imageUrl);
        let postData = {...post,mentions:mUsers, createdTime: time, updatedTime: time, createdBy: userToken?._id,device:device}
        formData.append('post',JSON.stringify(postData));
        dispatch(createPost(formData))
    };
    let {title, content} = post;
    return (
        <>
            <div className='flex justify-evenly items-center rounded-[5px] flex-col p-8'>
                <div className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-first-name">
                                Title
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="grid-first-name" type="text" name='title' value={title}
                                onChange={(e) => handleChange(e)} placeholder="Title"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Content
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                name='content' value={content} onChange={(e) => handleChange(e)}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Image
                            </label>
                            {file === null ? <><div className='bg-gray-300 border-gray-800 border-dashed border-[1px] h-[136px] box-border w-full'
                                                    onDrop={(e) => {
                                                        handleOnImportFile(e.dataTransfer.files);
                                                        e.preventDefault();
                                                    }}
                                                    onDragOver={e => e.preventDefault()}
                                >
                                    <div className='flex flex-col justify-center gap-[6px] h-full '>
                                        <div className='items-end h-[50%] flex justify-center w-full text-gray-800'> Drop your photo hear to post...</div>
                                        <div className='h-[50%] flex row justify-center'>
                                            <div
                                                className='flex items-center cursor-pointer'
                                                onClick={() => {
                                                    document.getElementById(`fileInput`).click();
                                                }}>
                                                <input type='file' id={`fileInput`} className='hidden'
                                                       onChange={(e) => {
                                                           handleOnImportFile(e.target.files);
                                                           e.preventDefault();
                                                       }}
                                                       accept={"image/png, image/jpeg, image/jpg"}
                                                />
                                                <label className='flex cursor-pointer items-center bg-gray-800 h-[32px] justify-center rounded-[4px] text-[#FCFCFC] text-[14px] w-[100px]'> Browse files </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    {(importError !== null) ? <div className='mt-2'>
                                        <span style={{color:'red'}}>{importError}</span>
                                    </div>:''}
                                </>:
                                <div className='flex row mt-2 w-full'>
                                    <div><img src={file} height='150' width='150'/></div>
                                    <div className='ml-1 cursor-pointer'><GrFormClose size={28} onClick={()=>setFile(null)}/></div>
                                </div>}
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Mentions
                            </label>
                            <div>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{'tag'}</span>
                            </div>
                            <MentionsInput value={mentions} onChange={(e,data,value)=>{ handleMentions(e,data,value)}} className={'h-[40px]'}>
                                <Mention
                                    trigger="@"
                                    data={mentionUsers}
                                    markup={'@[display](__id__)'}
                                    appendSpaceOnAdd={true}
                                    style={{
                                        backgroundColor: "#00ffff",
                                        borderRadius:'5px',
                                    }}
                                    onAdd={(id)=>{
                                        setMentionUsers([...mentionUsers.filter(ele => ele.id !== id)]);
                                        let value = id.slice(1);
                                        setPost({...post,mentions:[...post.mentions,value]});
                                    }}
                                />
                                <Mention
                                    trigger="#"
                                    data={[{id:'Hiren Bhuva'}]}
                                />
                            </MentionsInput>
                        </div>
                    </div>
                    <div className='row flex h-[60px] md:mt-4 sm:mt-4 '>
                        <div className='w-full mr-1'>
                            <button onClick={(e) => handleCreate(e)}
                                    className='hover:bg-white disabled:bg-gray-400 bg-gray-800 border disabled:border-gray-400 border-gray-800 rounded-[6px] h-[40px] w-full hover:text-gray-800 text-white disabled:text-white disabled:cursor-no-drop'
                                    disabled={loading}>
                                {loading ?
                                    <div className="flex items-center justify-center text-[black]">
                                        <div className="w-5 h-5 border-b-2 border-gray-900 rounded-full animate-spin mr-2"></div> Creating...
                                    </div> : "Create"}
                            </button>
                        </div>
                        <div className='w-full ml-1'>
                            <button onClick={() => {
                                navigate('/')
                            }}
                                    className='hover:bg-white bg-red-800 text-white border border-red-400 rounded-[6px] h-[40px] w-full hover:text-red-400'>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost;