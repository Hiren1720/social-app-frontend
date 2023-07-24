import * as types from '../Actions/Types'

const initialState = {
    loading: false,
    postResult: null,
    postLikeResult:null,
    posts:[],
    total:0,
    likes:[],
    comments:[],
    likeLoading: false,
    commentLoading:false,
    commentResult:null
}

const post = (state = initialState, action) => {

    console.log("state", state.posts, "action",action)
    switch (action.type) {
        case types.SET_POST_LOADING:
            return {...state, [action.key]: action.loading};
        case types.SET_USER_STATE:
            return {...state, [action.state]: action.payload};
        case types.SET_POST_RESPONSE:
        case types.DELETE_POST_RESPONSE:
        case types.SAVE_POST_RESPONSE:
            return {...state, postResult: action.payload, loading: action.loading};
        case types.GET_POST_RESPONSE:
            // return {...state, posts: action?.state !== 'getPost' ? [...action.payload]: action.payload,total:action.total, loading: action.loading};
            // return {...state, posts: action?.state !== 'getPost' ? [...state?.posts,...action.payload]: action.payload,total:action.total, loading: action.loading};
if(action.state === 'getAllPost' ||action.state === 'getPostsByUserId'  ){
    return {...state, posts: state.posts.length < action.total ?  [...state.posts, ...action.payload] : action.payload,total:action.total, loading: action.loading};
}
else{
    return {...state, posts: action?.state !== 'getPost' ? [...state?.posts,...action.payload]: action.payload,total:action.total, loading: action.loading};
}

            // return {...state, posts: action.state !== 'getPost' && state.posts.length < action.total ? [...state.posts, ...action.payload] : action.payload,total:action.total, loading: action.loading};
           case types.GET_LIKES_COMMENTS_RESPONSE:
            return {...state, [action?.state]: action.payload, likeLoading: action.loading};
        case types.SET_POST_LIKE_RESPONSE:
            return {...state, postLikeResult: action.payload, loading: action.loading};
        case types.SET_COMMENT_RESPONSE:
            return {...state, commentResult: action.payload, commentLoading: action.loading};
        default:
            return state;
    }
};
export default post;
