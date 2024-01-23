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
import {getLikesCommentsSaga} from "./PostSagas/getLikesCommentsSaga";
import {createCommentSaga} from "./CommentSagas/createCommentSaga";
import {getMentionPostsSaga} from "./PostSagas/getMentionPostsSaga";
import {getProfileViewersSaga} from "./UserSagas/getProfileViewersSaga";
import {userForgetPasswordSaga} from "./AuthSagas/forgetPasswordSaga";
import {userResetPasswordSaga} from "./AuthSagas/resetPasswordSaga";
import {setUserStatusSaga} from "./AuthSagas/setUserStatusSaga";
import {deleteAccountSaga} from "./UserSagas/deleteAccountSaga";
import {blockUserSaga} from "./BlockUserSaga/blockUserSaga";
import {deletePostSaga} from "./PostSagas/deletePostSaga";
import {setSettingSaga} from "./UserSagas/setSettingSaga";
import {setVisitorTimeSaga} from "./UserSagas/setVisitorTimeSaga";
import {getDailyUsagesSaga} from "./UserSagas/getDailyUsagesSaga";
import {savePostSaga} from "./PostSagas/savePostSaga";
import {deleteFromCloudinarySaga} from "./PostSagas/deleteFromCloudinarySaga";

import {getStoriesSaga} from "./StorySagas/getStoriesSaga";

import {createStoriesSaga} from "./StorySagas/createStoriesSaga";
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
        getLikesCommentsSaga(),
        createCommentSaga(),
        getMentionPostsSaga(),
        getProfileViewersSaga(),
        userForgetPasswordSaga(),
        userResetPasswordSaga(),
        blockUserSaga(),
        deletePostSaga(),
        deleteAccountSaga(),
        savePostSaga(),
        setSettingSaga(),
        setVisitorTimeSaga(),
        getDailyUsagesSaga(),
        setUserStatusSaga(),
        deleteFromCloudinarySaga(),
        createStoriesSaga(),
        getStoriesSaga(),
    ]);
}
