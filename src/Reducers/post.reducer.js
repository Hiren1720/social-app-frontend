import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    postResult: null,
    postLikeResult:null,
    posts:[],
    likes:[],
    comments:[],
    likeLoading: false,
    commentLoading:false,
    commentResult:null,
    savedPost:{},
    savedPostResult:null
}

const post = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_POST_LOADING:
            return {...state, [action.key]: action.loading};
        case types.SET_USER_STATE:
            return {...state, [action.state]: action.payload};
        case types.SET_POST_STATE_SUCCESS:
        case types.SET_POST_STATE_FAILURE:
        case types.SET_DELETE_POST_STATE_SUCCESS:
        case types.SET_DELETE_POST_STATE_FAILURE:
        case types.SET_UPDATE_POST_STATE_SUCCESS:
        case types.SET_UPDATE_POST_STATE_FAILURE:
            return {...state, postResult: action.payload, loading: action.loading};
        case types.GET_POST_STATE_SUCCESS:
        case types.GET_POST_STATE_FAILURE:
            return {...state, posts: action.payload, loading: action.loading};
        case types.SET_SAVED_POST_SUCCESS:
        case types.SET_SAVED_POST_FAILURE:
            return {...state, savedPostResult: action.payload,loading: action.loading};
        case types.GET_SAVED_POST_SUCCESS:
        case types.GET_SAVED_POST_FAILURE:
            return {...state, savedPost: action.payload,loading: action.loading};
        case types.GET_LIKE_STATE_SUCCESS:
        case types.GET_LIKE_STATE_FAILURE:
            return {...state, likes: action.payload, likeLoading: action.loading};
        case types.SET_POST_LIKE_STATE_SUCCESS:
        case types.SET_POST_LIKE_STATE_FAILURE:
            return {...state, postLikeResult: action.payload, loading: action.loading};
        case types.SET_COMMENT_STATE_SUCCESS:
        case types.SET_COMMENT_STATE_FAILURE:
            return {...state, commentResult: action.payload, commentLoading: action.loading};
        case types.GET_COMMENT_STATE_SUCCESS:
        case types.GET_COMMENT_STATE_FAILURE:
            return {...state, comments: action.payload, likeLoading: action.loading};
        default:
            return state;
    }
};
export default post;
