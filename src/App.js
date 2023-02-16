import React, {useEffect} from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import io from 'socket.io-client';
import Login from "./Components/Authencation/LoginPage";
import Registration from "./Components/Authencation/Registration";
import Header from "./Components/Layouts/Header";
import 'react-toastify/dist/ReactToastify.css';
import Requests from "./Components/FollowFollowing/Requests";
import Followers from "./Components/FollowFollowing/Followers";
import Followings from "./Components/FollowFollowing/Followings";
import Profile from "./Components/User/Profile";
import PostPage from "./Components/Posts/Posts";
import CreatePost from "./Components/Posts/CreatePost";
import {getTokenObject} from "./Helper/TokenHandler";

const socket = io('https://social-app-backend-weld.vercel.app/', {
  transports: ["websocket"]
});
function App() {
  let user = getTokenObject();
  useEffect(()=>{
    if(user && user?.user_id){
      socket.emit('joinUserId',user?.user_id)
    }
  },[user])
  return (
    <div className="App">
        <BrowserRouter>

          <Routes>
            <Route path='/login' element={<Login socket={socket}/>}  />
            <Route path='/register' element={<Registration/>}  />
            <Route path='/' element={<Header/>} >
              <Route index element={<PostPage socket={socket}/>}  />
              <Route path='post' element={<CreatePost/>}  />
              <Route path='profile/:id' element={<Profile/>}  />
              <Route path='requests' element={<Requests/>}  />
              <Route path='followers' element={<Followers/>}  />
              <Route path='followings' element={<Followings/>}  />
            </Route>
            <Route path='*' element={<h1>404 Page not found.</h1>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
