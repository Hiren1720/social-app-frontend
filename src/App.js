import React, {useEffect} from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import io from 'socket.io-client';
import Login from "./Components/Authencation/LoginPage";
import Registration from "./Components/Authencation/Registration";
import Header from "./Components/Layouts/Header";
import 'react-toastify/dist/ReactToastify.css';
import Requests from "./Components/FollowFollowing/Requests";
import Followers from "./Components/FollowFollowing/Followers";
import Profile from "./Components/User/Profile";
import CreatePost from "./Components/Posts/CreatePost";
import {getLocalStorageData} from "./Helper/TokenHandler";
import Users from "./Components/User/Users";
import {ToastContainer,toast} from "react-toastify";
import VerifyOTP from "./Components/Authencation/VerifyOTP";
import Home from "./Components/Dashboard/Home";
import ForgetPassword from './Components/Authencation/ForgetPassword';
import ResetPassword from './Components/Authencation/ResetPassword';
import './App.css'
import SharedPost from "./Components/Posts/SharedPost";

function App() {
  const [socket] = React.useState(io('http://localhost:4040/', {
    transports: ["websocket"]
  }));
  let user = getLocalStorageData('user');
  useEffect(()=>{
    if(user && user?._id){
      socket.emit('joinUserId',user?._id)
    }
    if (!("Notification" in window)) {
      toast.error("Browser does not support desktop notification");
    } else {
      // toast.success("Notifications are supported");
      Notification.requestPermission();
    }
    // eslint-disable-next-line
  },[user])

  return (
    <div className="w-full h-screen ">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login socket={socket}/>}  />
          <Route path='/sign-up' element={<Registration/>}  />
          <Route path='/verify-otp' element={<VerifyOTP/>}  />
          <Route path='/reset-password/:id' element={<ResetPassword/>}  />
          <Route path='/forget-password' element={<ForgetPassword/>}/>
          <Route path='/' element={<Header/>} >
            <Route index element={<Home socket={socket}/>}/>
            <Route path='post' element={<CreatePost/>}  />
            <Route path='edit-post' element={<CreatePost/>}  />
            <Route path='profile/:id' element={<Profile socket={socket}/>}  />
            <Route path='/edit-profile' element={<Registration/>}  />
            <Route path='requests' element={<Requests/>}  />
            <Route path='followers' element={<Followers/>}  />
            <Route path='users' element={<Users/>}  />
            <Route path='post/:userName/:postId' element={<SharedPost socket={socket}/>}  />
          </Route>
          <Route path='*' element={<h1>404 Page not found.</h1>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
