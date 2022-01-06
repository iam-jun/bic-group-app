import postTypes from './types';

const initState = {
  createPost: {
    loading: false,
    isOpenModal: false,
    data: {
      content: '',
      images: [],
      videos: [],
      files: [],
    },
    chosenAudiences: [],
    searchResultAudienceGroups: [],
    searchResultAudienceUsers: [],
    important: {
      active: 0,
      expiresTime: '',
    },
    images: [],
    imagesDraft: [],
  },
  createComment: {
    loading: false,
    content: '',
  },
  reactionBottomSheet: {
    show: false,
    title: '',
    position: {x: -1, y: -1},
    callback: undefined,
  },
  mention: {
    searchLoading: false,
    searchKey: '',
    searchResult: [],
  },
  replyingComment: {},
  allPosts: {},
  allComments: {},
  allCommentsByParentIds: {},
  draftPosts: {
    posts: [],
    canLoadMore: true,
    loading: false,
    refreshing: false,
  },
  postAudienceSheet: {
    isShow: false,
    data: undefined,
    fromStack: '',
  },
};

function postReducer(state = initState, action: any = {}) {
  const {type, payload} = action;

  switch (type) {
    case postTypes.SET_ALL_POSTS:
      return {
        ...state,
        allPosts: payload,
      };
    case postTypes.SET_ALL_COMMENTS:
      return {
        ...state,
        allComments: payload,
      };
    case postTypes.SET_DRAFT_POSTS:
      return {
        ...state,
        draftPosts: payload || initState.draftPosts,
      };
    case postTypes.SET_LOADING_CREATE_POST:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          loading: payload,
        },
      };
    case postTypes.CLEAR_CREATE_POST:
      return {
        ...state,
        createPost: initState.createPost,
      };
    case postTypes.SET_CREATE_POST_DATA:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          data: payload,
        },
      };
    case postTypes.SET_CREATE_POST_DATA_IMAGES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          data: {
            ...state.createPost.data,
            images: payload,
          },
        },
      };
    case postTypes.SET_CREATE_POST_SETTINGS:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          ...payload,
        },
      };
    case postTypes.SET_CREATE_COMMENT:
      return {
        ...state,
        createComment: {
          ...state.createComment,
          ...payload,
        },
      };
    case postTypes.SET_CREATE_POST_CHOSEN_AUDIENCES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          chosenAudiences: payload,
        },
      };
    case postTypes.SET_CREATE_POST_IMPORTANT:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          important: payload || initState.createPost.important,
        },
      };
    case postTypes.SET_CREATE_POST_IMAGES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          images: payload || [],
        },
      };
    case postTypes.SET_CREATE_POST_IMAGES_DRAFT:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          imagesDraft: payload || [],
        },
      };
    case postTypes.SET_SEARCH_RESULT_AUDIENCE_GROUPS:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          searchResultAudienceGroups: payload,
        },
      };
    case postTypes.SET_SEARCH_RESULT_AUDIENCE_USERS:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          searchResultAudienceUsers: payload,
        },
      };
    case postTypes.SET_POST_DETAIL_REPLYING_COMMENT:
      return {
        ...state,
        replyingComment: payload,
      };
    case postTypes.SET_POST_AUDIENCES_BOTTOM_SHEET:
      return {
        ...state,
        postAudienceSheet: payload,
      };
    case postTypes.HIDE_POST_AUDIENCES_BOTTOM_SHEET:
      return {
        ...state,
        postAudienceSheet: initState.postAudienceSheet,
      };
    case postTypes.SET_ALL_COMMENTS_BY_PARENT_IDS:
      return {
        ...state,
        allCommentsByParentIds: payload,
      };
    case postTypes.SET_SHOW_REACTION_BOTTOM_SHEET:
      return {
        ...state,
        reactionBottomSheet: payload || initState.reactionBottomSheet,
      };
    default:
      return state;
  }
}

export default postReducer;
