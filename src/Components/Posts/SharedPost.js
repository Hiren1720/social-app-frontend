import React from 'react';
import {useSelector} from "react-redux";
import Post from '../Posts/Posts';
import Loader from "../Layouts/Loader";

const Home = ({socket}) => {
    const post = useSelector(state => state.postData.post);
    const loading = useSelector(state => state.userData.loading);
    return (
        <>
            {loading ? <Loader/> :
                <div className="flex justify-center">
                    <Post socket={socket} post={post}/>
                </div>
            }
        </>
    );
}
export default Home;
