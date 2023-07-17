import React from 'react';
import {useSelector} from "react-redux";
import Post from '../Posts/Posts';
import Loader from "../Layouts/Loader";
import {useParams} from "react-router-dom";

const Home = ({socket}) => {
    const {postId} = useParams();
    const loading = useSelector(state => state.userData.loading);
    return (
        <>
            {loading ? <Loader/> :
                <div className="flex justify-center">
                    <Post socket={socket} id={postId} type={'getPost'}/>
                </div>
            }
        </>
    );
}
export default Home;
