import React from 'react';
import Modal from "react-modal";
import {FaWindowClose} from "react-icons/fa";
import useWidthHeight from "../../Hooks/useWidthHeight";

const url = process.env.REACT_APP_API_URL;
const ProfilePhoto = ({open,closeModal,imageUrl = ''}) => {
    let subtitle;
    const {width} = useWidthHeight();
    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }
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
    return (
        <Modal
            isOpen={open}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="max-w-2xl mx-auto ">
                <div className="flex justify-end max-w-md bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 ">
                    <div
                        className="text-sm font-medium cursor-pointer hover:underline dark:text-blue-500"
                        onClick={closeModal}>
                        <FaWindowClose size={25}/>
                    </div>
                </div>
                <div className='mt-2'>
                    <img src={imageUrl.includes('https') ? imageUrl : `${url}/${imageUrl}`} width={400} height={400} alt='profile'/>
                </div>
            </div>
        </Modal>
    )
};

export default ProfilePhoto;