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
  },
  reactionBottomSheet: {
    show: false,
    title: '',
    callback: undefined,
  },
  mention: {
    searchKey: '',
    searchResult: [],
  },
  postDetail: {},
  replyingComment: {},
  allPosts: {},
  allCommentsByParentIds: {},
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
    case postTypes.SET_OPEN_POST_TOOLBAR_MODAL:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          isOpenModal: payload,
        },
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
    case postTypes.SET_POST_DETAIL:
      return {
        ...state,
        postDetail: payload,
      };
    case postTypes.SET_POST_DETAIL_REPLYING_COMMENT:
      return {
        ...state,
        replyingComment: payload,
      };
    //mention
    case postTypes.SET_MENTION_SEARCH_KEY:
      return {
        ...state,
        mention: {
          ...state.mention,
          searchKey: payload,
        },
      };
    case postTypes.SET_MENTION_SEARCH_RESULT:
      return {
        ...state,
        mention: {
          ...state.mention,
          searchResult: payload,
        },
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
