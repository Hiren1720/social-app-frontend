import React, {useEffect, useState} from "react";
import {BiPlus} from "react-icons/bi";
import {tobase64Handler} from "../../Helper";
import {GrFormClose} from "react-icons/gr";
import Modal from "react-modal";
import {FaWindowClose} from "react-icons/fa";
import Stories from 'react-insta-stories';
import "../Common/Card.css"
import {createStories, getStories} from "../../Actions/storyAction";
import {useDispatch, useSelector} from "react-redux";

const cloudName = process.env.REACT_APP_CLOUDNAME;
const uploadPreset = process.env.REACT_APP_STORIES_CLOUD_PRESET_NAME;
const Story = () => {
    const [modal, setModal] = useState({open: false, data: null, title: null});
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const storiesData = useSelector(state => state.storiesData.stories?.data)
    const storiesResult = useSelector(state => state.storiesData?.storiesResult)

    let subtitle;
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            width: '430px',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    useEffect(() => {
        dispatch(getStories())
    }, [])
    useEffect(() => {
        dispatch(getStories())
    }, [86400])
    useEffect(() => {
        if(storiesResult?.success){
            dispatch(getStories())
        }
    }, [storiesResult])
    function closeModal() {
        setModal({open: false, data: null, title: null});
    }

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    const StoryShowModal = () => {
        return (<div className='StoriesContainer'><Stories stories={modal.data?.story_url}/></div>)
    }
    const StoryCreateModal = () => {
        return (
            <div className='StoriesContainer'>{modal.data?.length > 0 && <Stories stories={files}/>}
                <button type="button"  onClick={() => handleStoryUploader()}
                        className="px-3 text-xs mt-2 h-8 w-full font-medium text-center flex justify-center  items-center text-white bg-[#5596e6] rounded-lg   focus:outline-none ">
                    Publish
                </button>
            </div>)
    }
    const handleStoryUploader = () => {
        dispatch(createStories({story_url: [...files]}));
        setFiles([]);
        setModal({open:false,data:null,title:null})
    }
    const handleOnImportFiles = async (fileData) => {
        let storiesFiles = [];
        const formData = new FormData();
        if (fileData.length <= 10) {
            Array.from(fileData).forEach((ele, id) => {
                let extension = ele.name.split('.').pop().replace(' ', '');
                if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png' && extension !== 'mp4') {
                    // setImportError('Post Only JPEG,JPG & PNG File');
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
                            storiesFiles.push(res.secure_url);
                            setFiles([...files, ...storiesFiles]);
                        })
                        .catch(err => console.log(err));
                }
            });
            setModal({open:true,data:storiesFiles,title:'Create'})
        }
    }

    // <div className=' mt-2 w-full justify-between  relative'>
    //     <div id="gallery" className="flex -m-1 relative" data-testid='gallery'>
    //         {files?.length > 0 ? (
    //             <div className="grid grid-cols-3 gap-2 mt-2">
    //                 {files.map((file, id) => {
    //                     const fileExtension = file?.split('.').pop().toLowerCase();
    //                     const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
    //                     return (
    //                         <div
    //                             className="flex justify-between relative mb-2 border border-black border-2 rounded-t-lg"
    //                             key={id}
    //                         >
    //                             {isVideo ? (
    //                                 <video src={file} autoPlay controls={true}/>
    //                             ) : (
    //                                 <img
    //                                     className="rounded-t-lg w-40 h-40"
    //                                     src={file}
    //                                     height="150"
    //                                     width="150"
    //                                     alt="PostImage"
    //                                 />
    //                             )}
    //                             <GrFormClose
    //                                 size={28}
    //                                 className="absolute top-[8px] right-[16px] bg-white rounded-full cursor-pointer hover:bg-gray-200"
    //                                 onClick={() => handleDeleteImages(file, id)}
    //                             />
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         ) : (
    //             <div id="gallery" className="flex flex-1 flex-wrap -m-1 mt-2">
    //                 <div
    //                     id="empty"
    //                     className="h-full w-full text-center flex flex-col items-center justify-center items-center"
    //                 >
    //                     <img
    //                         className="mx-auto w-32"
    //                         src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
    //                         alt="no data"
    //                     />
    //                     <span className="text-small text-gray-500">No files selected</span>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    //
    //     {files?.length > 0 && <div className='ml-1 cursor-pointer mt-2 flex justify-end'>
    //         <label onClick={() => {
    //             setFiles([]);
    //             setPost({...post, imageUrl: []})
    //         }}
    //                className='flex cursor-pointer items-center bg-gray-800 h-[32px] justify-center rounded-[4px] text-[#FCFCFC] text-[14px] w-[100px]'> Cancel</label>
    //     </div>}
    // </div>
    return (<div
        className=" bg-white rounded-2xl border   dark:bg-gray-800 dark:border-gray-700">
        <div
            className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h3 className="text-sm font-bold leading-none text-gray-900 dark:text-white">Stories</h3>
            <a href="#"
               className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                View all
            </a>
        </div>
        <div className="flow-root">
            <ul role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700 w-full">
                <li className="p-3 sm:p-4" onClick={() => {

                    document.getElementById(`storyInput`).click();
                }}><input type='file' id={`storyInput`} className='hidden' data-testid='fileInput'
                          onChange={(e) => {
                              handleOnImportFiles(e.target.files);
                              e.preventDefault();
                          }}
                          multiple={true}
                          accept={"image/png, image/jpeg, image/jpg, video/mp4, video/mp3"}
                />
                    <div className="flex items-center relative space-x-4">
                        <div
                            className="flex-shrink-0 flex border-dashed border-[2px] w-12 h-12 border-neutral-300 p-1 rounded-full items-center justify-center text-neutral-300 hover:border-solid hover:border-neutral-600 hover:text-neutral-600 cursor-pointer">
                            <BiPlus/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Add a new Story
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                Share an image, a video or some text
                            </p>
                        </div>
                    </div>
                </li>
                {storiesData?.map((ele) => (
                    <li className="p-3 sm:p-4" onClick={() => setModal({open: true, title: 'Story', data: ele})}>
                        <div className="flex items-center space-x-4">
                            <div
                                className="flex-shrink-0 border-[2px] border-neutral-600 p-1 rounded-full">
                                <img className="w-12 h-12 rounded-full"
                                     src={ele?.author_info[0]?.profile_url}
                                     alt={ele?.author_info[0]?.userName}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {ele?.author_info[0]?.userName}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {ele?.createdAt}
                                </p>
                            </div>
                        </div>
                    </li>))}
            </ul>
        </div>
        <Modal
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
                            Story: StoryShowModal(),
                            Create: StoryCreateModal(),
                        }[modal.title]
                    }
                </div>
            </div>
        </Modal>
    </div>)
}
export default Story;
