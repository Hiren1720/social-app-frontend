import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import ReactStars from "react-rating-stars-component";
import {BsInfoCircle} from "react-icons/bs";
import {getProfile, getProfileViewers} from "../../Actions/userActions";
import {getLocalStorageData} from "../../Helper/TokenHandler";
import PersonalDetail from "./PersonalDetail";
import Followers from "./Followers";
import {
    getRequests,
    removeFollower,
    sendRequest,
    setRequest,
    updateRequest
} from "../../Actions/requestActions";
import './User.css';
import Loader from "../Layouts/Loader";
import ButtonLoader from "../ButtonLoader";
import Posts from '../Posts/Posts';
import {getStatus} from '../../Helper';
import PortFolio from "../Addvertisement/Portfolio";
import PrivateAccount from '../Common/PrivateAccount'
import ProfileViewedPeople from "../Common/ProfileViewedPeople";
const url = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;
const Profile = () => {
    const {id} = useParams();
    const userData = getLocalStorageData('user');
    const dispatch = useDispatch();
    const user = useSelector(state => state.userData.profile);
    const loading = useSelector(state => state.userData.loading);
    const buttonLoading = useSelector(state => state.requestData.buttonLoading);
    const requests = useSelector(state => state.requestData.requests);
    const requestResult = useSelector(state => state.requestData.requestResult);
    const savedPostResult = useSelector(state => state.postData.savedPostResult);
    const postResult = useSelector(state => state.postData.postResult);
    const [active, setActive] = useState('Posts');
    const tabs = [{tab: 'Posts', length: user?.posts?.length}, {
        tab: 'Followers', length: user?.followers?.length},
        {tab: 'Followings', length: user?.followings?.length},
       {tab: "SavedPost", length: user?.savedPost}
    ];
    const navigate = useNavigate();
    useEffect(() => {
        if (requestResult && requestResult?.success) {
            dispatch(getRequests({type: 'allRequest'}));
            dispatch(getProfile({id: id,isLoading: true}));
            dispatch(getProfile({id: userData?._id, isLoggedInUser: true,isLoading: true}));
            dispatch(setRequest());
            if (id === userData?._id) {
                dispatch(getProfileViewers());
            }

        }
        // eslint-disable-next-line
    }, [requestResult]);
    useEffect(() => {
        if (id) {
            dispatch(getProfile({id: id}));
            dispatch(getRequests({type: 'allRequest'}));
            if (id === userData?._id) {
                dispatch(getProfileViewers());
            }
        }
        // eslint-disable-next-line
    }, [id]);
    useEffect(()=> {
        if(savedPostResult|| postResult){
            dispatch(getProfile({id: id,isLoading:true}));
        }
        // eslint-disable-next-line
    },[savedPostResult,postResult]);
    const renderUserDetails = () => {
        switch (active) {
            case 'Followings':
            case 'Followers':
                return <Followers user={user} type={active} setActive={setActive}/>;
            case 'Posts':
                return <Posts id={id} type={"getPostsByUserId"}/>;
            case 'SavedPost':
                return <Posts type={"getSavedPosts"}/>;
            case 'Profile':
            default:
                return <PersonalDetail user={user}/>;
        }
    }
    const handleButton = (e, item, status) => {
        if (userData?._id === id) {
            navigate('/edit-profile', {state: item});
            e.stopPropagation();
        } else if (status === 'Follow') {
            dispatch(sendRequest({toUserId: item?._id, fromUserId: userData?._id}));
        } else if (status === 'UnFollow') {
            dispatch(removeFollower({followerId: userData?._id, followingId: item?._id, status: 'UnFollow'}));
        } else if (status === 'Requested') {
            let req = requests && requests.data && requests.data.filter(ele => ele?.fromUserId === userData?._id).find((ele) => ele?.toUserId === item?._id);
            if (req) {
                dispatch(updateRequest({id: req?._id, status: status}));
            }
        }
    };
    const socialModal = [{
        color: "#1877f2",
        link: `https://www.facebook.com/sharer.php?u=${appUrl}/Profile/${id}`,
        title: "facebook",
        path: "M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"
    },
        {
            color: "#1d9bf0",
            link: `https://twitter.com/intent/tweet?text=${appUrl}/profile/${id}`,
            title: "twitter",
            path: "M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        },
        {
            color: "#25D366",
            link: `https://api.whatsapp.com/send?text=${appUrl}/profile/${id}`,
            title: "whatsapp",
            path: "M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
        },
        {
            color: "#229ED9",
            link: `https://t.me/share/url?text=Lorem Ipsum&url=${appUrl}/profile/${id}`,
            title: "telegram",
            path: "m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"
        },]
    return (
        <>
            {loading ? <Loader/> :
                <>
                    {(user) ? <>
                        <main className="profile-page ">
                            <div>
                                <div
                                    className="relative top-0 w-full h-40 md:h-80 bg-[url('https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Munnar_destjulimg_2_l_770_1154.jpg')] bg-no-repeat object-contain bg-cover bg-center ">
                                    <span id="blackOverlay"
                                          className="w-full h-full absolute opacity-50 bg-black"/>
                                </div>
                                <div
                                    className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px">
                                    <svg className="absolute bottom-0 overflow-hidden"
                                         xmlns="http://www.w3.org/2000/svg"
                                         preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                                        <polygon className="text-blueGray-200 fill-current"
                                                 points="2560 0 2560 100 0 100"/>
                                    </svg>
                                </div>
                            </div>

                            <div
                                className="font-sans mt-0 flex lg:order-1 flex-row text-center sm:flex-row sm:text-left  shadow-lg px-6 bg-white shadow  w-full ">
                                <div
                                    className="flex w-full  md:justify-between hidden md:flex sm:items-center ">
                                    <div className="w-40 hidden lg:flex"/>
                                    <div className="grid grid-cols-4 lg:gap-10 md:gap-2">
                                        {tabs.map((tab, index) => (
                                            <div key={index} className={`${userData?._id !== id && tab?.tab === 'SavedPost'? 'hidden':'block' }`}
                                                 onClick={() => setActive(tab.tab)}>
                                                <button type="button"
                                                        className={` text-black w-full py-2.5 text-md font-bold  font-normal text-center inline-block ${active === tab.tab ? 'border-b-4 border-black' : ''}`}>{tab.tab}
                                                    <span
                                                        className="text-xl font-bold block uppercase py-2 tracking-wide text-blueGray-600 text-center">{tab.length}</span>
                                                </button>
                                            </div>

                                        ))}
                                    </div>

                                    <div className='flex h-[60px] justify-between ml-20  items-center'>
                                        <div>
                                            {user?.rating ?
                                                <ReactStars
                                                    count={5}
                                                    onChange={() => {
                                                    }}
                                                    edit={false}
                                                    size={24}
                                                    value={user?.rating}
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"/>}
                                                    halfIcon={<i className="fa fa-star-half-alt"/>}
                                                    fullIcon={<i className="fa fa-star"/>}
                                                    activeColor={user?.rating <= 2 ? "#ff0000" : "#ffd700"}
                                                />
                                                : ''}
                                        </div>
                                        <div className='mx-4 max-[400px]:mx-2'>
                                            <button
                                                onClick={(e) => handleButton(e, user, getStatus(user, requests, userData, 'Followings', false))}
                                                className='bg-white border-[3px] font-bold border-sky-700 rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>{buttonLoading ?
                                                <ButtonLoader/> : userData?._id === id ? "Edit Profile" : getStatus(user, requests, userData, 'Followings', false)}
                                            </button>
                                        </div>
                                        <div className='mx-4 max-[400px]:mx-2 hidden'>
                                            <button
                                                className='bg-white border-[3px] border-gray rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>Call
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="2xl:mx-[208px] flex  max-[380px]:mx-[0px]  ">
                                <div
                                    className="relative bg-blueGray-200 flex-col w-full lg:grid lg:gap-4 2xl:gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:row-span-2 ">
                                    <div className="container mx-auto pt-[214px]">
                                        <div
                                            className="relative flex  min-w-0 break-words  w-full sm:mb-6 -mt-64 justify-center rounded-lg">
                                            <div className="px-1">
                                                <div className="flex flex-wrap justify-center">
                                                    <div className="w-full px-4 flex justify-center">
                                                        <div className="relative w-full h-20 flex justify-center">
                                                            <img
                                                                className="shadow-xl bg-[white] p-[5px] object-cover
                                                    transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 rounded-full align-middle border-none absolute -m-20 -ml-20  max-w-150-px w-40 h-40"
                                                                src={user?.profile_url ? user?.profile_url.includes('https') ? user?.profile_url : `${url}/${user?.profile_url}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                                alt=""/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="w-full px-4  lg:text-start lg:self-center rounded-lg">
                                                        <h2 className="text-center text-2xl font-semibold mt-3">{user?.userName}</h2>
                                                        <p className="text-center text-gray-600 mt-1">{user?.name}</p>
                                                    </div>
                                                    <div
                                                        className='flex h-[60px] pl-4 justify-between w-full items-center md:hidden'>
                                                        <div>
                                                            {user?.rating ?
                                                                <ReactStars
                                                                    count={5}
                                                                    onChange={() => {
                                                                    }}
                                                                    edit={false}
                                                                    size={24}
                                                                    value={user?.rating}
                                                                    isHalf={true}
                                                                    emptyIcon={<i className="far fa-star"/>}
                                                                    halfIcon={<i className="fa fa-star-half-alt"/>}
                                                                    fullIcon={<i className="fa fa-star"/>}
                                                                    activeColor={user?.rating <= 2 ? "#ff0000" : "#ffd700"}
                                                                />
                                                                : ''}
                                                        </div>
                                                        <div className='mx-4 max-[400px]:mx-2'>
                                                            <button
                                                                onClick={(e) => handleButton(e, user, getStatus(user, requests, userData, 'Followings', false))}
                                                                className='bg-white border-[3px] border-sky-700 rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400 font-bold'>{buttonLoading ?
                                                                <ButtonLoader/> : userData?._id === id ? "Edit Profile" : getStatus(user, requests, userData, 'Followings', false)}
                                                            </button>
                                                        </div>
                                                        <div className='mx-4 max-[400px]:mx-2 hidden'>
                                                            <button
                                                                className='bg-white border-[3px] border-gray rounded-[6px] h-[40px] max-[400px]:w-[120px] max-[340px]:w-[100px] max-[340px]:text-[14px] w-[150px] text-black-400'>Call
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="mt-5 mx-[20px]">
                                                            <div className="flex justify-between">
                                                                <h3 className="text-xl font-semibold">Bio</h3>
                                                                <BsInfoCircle
                                                                    onClick={() => user?.privacy && user?._id !== userData?._id ? "" : setActive('Profile')}
                                                                    className="cursor-pointer"/>
                                                            </div>
                                                            <p className="text-gray-600 mt-2 text-start">{user?.bio}</p>
                                                        </div>

                                                        <div className="my-4">

                                                            <div className="flex justify-around gap-4 my-4">
                                                                {socialModal.map((social) => <a
                                                                    className={`border hover:bg-[${social.color}] w-12 h-12 fill-[${social.color}] hover:fill-white hover:bg-black border-sky-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-sky-500/50 cursor-pointer`}
                                                                    href={social.link}
                                                                    type="button"
                                                                    data-action={`share/${social.title}/share`}
                                                                    rel="noreferrer"
                                                                    target="_blank">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            d={social.path}
                                                                        />
                                                                    </svg>
                                                                </a>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="bg-white shadow shadow-lg w-full border-t border-gray-300 md:hidden ">
                                                    <div className={`grid ${userData?._id === id ?'grid-cols-4 ': 'grid-cols-3' } `}>
                                                        {tabs.map((tab, index) => (
                                                            <div key={index} className={`${userData?._id !== id && tab?.tab === 'SavedPost'? 'hidden':'block' }`}
                                                                 onClick={() => setActive(tab?.tab)}>
                                                                <button type="button"
                                                                        className={` text-black w-full py-2.5   text-sm hover:shadow-md font-normal text-center inline-block ${active === tab?.tab ? 'border-b-4 border-black' : ''}`}>{tab?.tab}
                                                                    <span
                                                                        className="text-xl font-bold block uppercase py-2 tracking-wide text-blueGray-600 text-center">{tab?.length}</span>
                                                                </button>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`${id === userData?._id ? '' : 'hidden'} mx-0 lg:visible max-[1024px]:hidden w-full`}>
                                            <ProfileViewedPeople/>
                                        </div>
                                    </div>
                                    <div
                                        className="container mx-auto col-span-1 lg:col-span-2 sm:col-span-5 max-[490px]:col-span-5 h-96 pt-6">
                                        {user?.privacy && id !== userData?._id && !userData?.followings?.includes(user?._id)  ?
                                            <PrivateAccount/>
                                            : renderUserDetails()}

                                    </div>
                                    <PortFolio/>
                                </div>
                            </div>

                        </main>
                    </> : <></>}
                </>
            }
        </>
    )
}
export default Profile;
