import {all} from "redux-saga/effects";
import {userRegisterSaga} from "./AuthSagas/userRegistrationSaga";
import {userLoginSaga} from "./AuthSagas/userLoginSaga";
import {gerAllUsersSaga} from "./AuthSagas/getAllUsersSaga";
import {userLogOutSaga} from "./AuthSagas/logoutSaga";
import {verifyOTPSaga} from "./AuthSagas/verifyOTPSaga";
import {sendRequestSaga} from "./RequestSagas/sendRequestSaga";
import {getRequestsSaga} from "./RequestSagas/getRequestsSaga";
import {updateRequestSaga} from "./RequestSagas/updateRequestSaga";
import {getFollowersSaga} from "./FollowerSagas/getFollowersSaga";
import {getProfileSaga} from "./UserSagas/getProfileSaga";
import {removeFollowerSaga} from "./FollowerSagas/removeFollowerSaga";
import {createPostSaga} from "./PostSagas/createPostSaga";
import {getAllPostSaga} from "./PostSagas/getAllPostSaga";
import {createLikeSaga} from "./PostSagas/createLikeSaga";
import {getAllLikesSaga} from "./PostSagas/getAllLikesSaga";
import {createCommentSaga} from "./CommentSagas/createCommentSaga";
import {getCommentsSaga} from "./CommentSagas/getCommentsSaga";

export default function* root() {
    yield all([
        userRegisterSaga(),
        userLoginSaga(),
        verifyOTPSaga(),
        gerAllUsersSaga(),
        userLogOutSaga(),
        sendRequestSaga(),
        getRequestsSaga(),
        updateRequestSaga(),
        getFollowersSaga(),
        getProfileSaga(),
        removeFollowerSaga(),
        createPostSaga(),
        getAllPostSaga(),
        createLikeSaga(),
        getAllLikesSaga(),
        createCommentSaga(),
        getCommentsSaga(),
    ]);
}