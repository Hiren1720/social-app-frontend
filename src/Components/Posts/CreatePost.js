import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Mention, MentionsInput} from 'react-mentions'
import {getAllUsers} from "../../Actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {createPost, resetPostResult} from "../../Actions/postActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import {GrFormClose} from 'react-icons/gr';
import getDeviceName from "../../Helper/getDeviceName";

const url = process.env.REACT_APP_API_URL;
const CreatePost = () => {
    const dispatch = useDispatch();
    let userToken = getLocalStorageData('user');
    const device = getDeviceName()
    const pathName = window.location.pathname;
    const users = useSelector(state => state.userData.users);
    const loading = useSelector(state => state.postData.loading);
    const postResult = useSelector(state => state.postData.postResult);
    const [mentionUsers, setMentionUsers] = useState([]);
    const [mentions, setMentions] = useState('');
    const [files, setFiles] = useState([]);
    const [importError, setImportError] = useState(null);
    const {state} = useLocation();
    const [post, setPost] = useState({
        content: '',
        title: '',
        imageUrl: '',
        likes: [],
        hashTags: [],
        comments: [],
        mentions: [],
    });
    useEffect(() => {
        if (pathName === '/edit-post') {
            if (state.imageUrl !== "") {
                let file = [];
                state?.imageUrl?.forEach((img) => {
                    file.push({selectedFile: `${url}/${img.url}`})
                });
                setFiles([...file])
            }

            let mUsers = state.mentions.length ? state.mentions.map((ele) => `@[display](@${ele.name})`) : []
            setMentions(mUsers.join(' '));
            setPost({...state, mentions: [...state.mentions.map(ele => ele.name)]})
        }
        // eslint-disable-next-line
    }, [pathName]);

    const navigate = useNavigate()
    useEffect(() => {
        dispatch(getAllUsers({searchValue: '', pageSize: 100, page: 0}))
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (users && users.length) {
            if (pathName === '/edit-post') {
                let mUsers = state.mentions.length ? state.mentions.map((ele) => `@[display](@${ele.name})`) : []
                let item = users.map((ele) => {
                    return {id: '@' + ele?.userName, display: '@' + ele?.userName};
                }).filter(ele => !mUsers.includes(`@[display](${ele.id})`));
                setMentionUsers([...item]);
            } else {
                let item = users.map((ele) => {
                    return {id: '@' + ele?.userName, display: '@' + ele?.userName};
                });
                setMentionUsers([...item]);
            }
        }
        // eslint-disable-next-line
    }, [users]);
    useEffect(() => {
        if (postResult) {
            if (pathName === '/edit-post') {
                navigate(`/profile/${userToken?._id}`)
            } else {
                navigate('/');
            }
            dispatch(resetPostResult())
        }
        // eslint-disable-next-line
    }, [postResult])
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
        } else {
            setPost({...post, [name]: value})
        }
    };
    const handleMentions = (e, data, value) => {
        let val = value.charAt(value.length - 1);
        if (val && val !== '@') {
            let data = users.filter(ele => !value.split('@').includes(ele.userName)).map(ele => {
                return {id: `@${ele.userName}`, display: `@${ele.userName}`}
            });
            setMentionUsers([...data])
        } else if (!value) {
            let data = users.map(ele => {
                return {id: `@${ele.userName}`, display: `@${ele.userName}`}
            });
            setMentionUsers([...data])
        }
        setPost({...post, mentions: value.split('@').filter(ele => ele)});
        if (value !== "@") {
            setMentions(e.target.value);
        } else {
            setMentions(e.target.value);
        }
    };
    const handleOnImportFile = async (fileData) => {
        if (fileData.length <= 10 || post.imageUrl.length < 10) {
            Array.from(fileData).forEach((ele, id) => {
                let extension = ele.name.split('.').pop().replace(' ', '');
                if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png' && extension !== 'mp4') {
                    setImportError('Post Only JPEG,JPG & PNG File');
                } else {
                    setImportError(null);
                }
                setPost({...post, imageUrl: [...post.imageUrl, ...fileData]});
            })
            let file = await tobase64Handler(Array.from(fileData));
            setFiles([...files, ...file]);
        } else {
            setImportError('You can post maximum 10 files!');
        }
    }
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    const tobase64Handler = async (files) => {
        const filePathsPromises = [];
        files.forEach(file => {
            filePathsPromises.push(toBase64(file));
        });
        const filePaths = await Promise.all(filePathsPromises);
        return filePaths.map((base64File) => ({selectedFile: base64File}));
    }
    const handleCreate = async (e) => {
        let mUsers = post?.mentions?.map((ele) => {
            let user = users.find((item) => ele.trim() === item?.userName)
            return {id: user?._id, name: user?.userName};
        });
        let formData = new FormData();
        Array.from(post?.imageUrl).forEach(file => {
            formData.append('postImage', file);
        });
        let postData = {...post, mentions: mUsers, createdBy: userToken?._id, device: device}
        formData.append('post', JSON.stringify(postData));
        dispatch(createPost({formData : formData,type: pathName === '/edit-post' ? 'update':'create'}));
    };
    const handleDeleteImages = (file, id) => {
        files.splice(id, 1);
        post.imageUrl.splice(id, 1);
        setFiles([...files]);
        setPost({...post, imageUrl: post.imageUrl})

    }
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
                            <div
                                className='bg-gray-300 border-gray-800 border-dashed border-[1px] h-[136px] box-border w-full'
                                onDrop={(e) => {
                                    handleOnImportFile(e.dataTransfer.files);
                                    e.preventDefault();
                                }}
                                onDragOver={e => e.preventDefault()}
                            >
                                <div className='flex flex-col justify-center gap-[6px] h-full '>
                                    <div
                                        className='items-end h-[50%] flex justify-center w-full text-gray-800'> Drop
                                        your photo hear to post...
                                    </div>
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
                                                   multiple={true}
                                                   accept={"image/png, image/jpeg, image/jpg, video/mp4, video/mp3"}
                                            />
                                            <label
                                                className='flex cursor-pointer items-center bg-gray-800 h-[32px] justify-center rounded-[4px] text-[#FCFCFC] text-[14px] w-[100px]'> Browse
                                                files </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(importError !== null) ? <div className='mt-2'>
                                <span style={{color: 'red'}}>{importError}</span>
                            </div> : ''}

                            <div className=' mt-2 w-full justify-between  relative'>
                                {files?.length > 0 ?<div id="gallery" className="flex -m-1 relative">
                                <div className='grid grid-cols-3 gap-2 mt-2'>{files?.length ? files.map((file, id) =>
                                        <div className="flex justify-between relative mb-2 border border-black border-2 rounded-t-lg"> <img className="rounded-t-lg w-40 h-40" src={file?.selectedFile}
                                            height='150' width='150' alt='PostImage'/><GrFormClose size={28} className="absolute top-[8px] right-[16px] bg-white rounded-full cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleDeleteImages(file, id)}/></div>) :
                                    ''}</div>
                                </div>:<>
                                    <div id="gallery" className="flex flex-1 flex-wrap -m-1 mt-2">
                                        <div id="empty"
                                            className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                            <img className="mx-auto w-32"
                                                 src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                                                 alt="no data"/>
                                            <span className="text-small text-gray-500">No files selected</span>
                                        </div>
                                    </div></>}

                                {files?.length > 0 && <div className='ml-1 cursor-pointer mt-2 flex justify-end'>
                                    <label onClick={() => {
                                            setFiles([]);
                                            setPost({...post, imageUrl: []})
                                        }}
                                       className='flex cursor-pointer items-center bg-gray-800 h-[32px] justify-center rounded-[4px] text-[#FCFCFC] text-[14px] w-[100px]'> Cancel</label>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="grid-password">
                                Mentions
                            </label>
                            <MentionsInput value={mentions} onChange={(e, data, value) => {
                                handleMentions(e, data, value)
                            }}
                               id="grid-first-name" type="text" name='mention'
                               className="w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight"
                               style={{
                                   control: {
                                       fontSize: 14,
                                       fontWeight: 'normal',
                                   },
                                   highlighter: {
                                       padding: 2,
                                       marginLeft: -4,
                                       border: '2px inset transparent',
                                   },
                                   '&multiLine': {
                                       input: {
                                           padding: 14,
                                       },
                                   },
                                   suggestions: {
                                       list: {
                                           backgroundColor: 'white',
                                           border: '1px solid rgba(0,0,0,0.15)',
                                           fontSize: 14,
                                       },
                                       item: {
                                           padding: '5px 15px',
                                           borderBottom: '1px solid rgba(0,0,0,0.15)',
                                           '&focused': {
                                               backgroundColor: '#cee4e5',
                                           },
                                       },
                                   },
                               }}
                            >
                                <Mention
                                    trigger="@"
                                    data={mentionUsers}
                                    markup={'@[display](__id__)'}
                                    appendSpaceOnAdd={true}
                                    style={{
                                        backgroundColor: "#00ffff",
                                        borderRadius: '5px',
                                    }}
                                    onAdd={(id) => {
                                        setMentionUsers([...mentionUsers.filter(ele => ele.id !== id)]);
                                    }}
                                />
                                <Mention
                                    trigger="#"
                                    data={[{id: 'Hiren Bhuva'}]}
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
                                        <div className="w-5 h-5 border-b-2 border-gray-900 rounded-full animate-spin mr-2"/>
                                        Creating...
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
