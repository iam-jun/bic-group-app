import {IFilePicked} from '~/interfaces/common';
import {ICommentData} from '~/interfaces/IPost';
import postTypes from './types';

export const postInitState = {
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
      active: false,
      expires_time: null,
    },
    images: [],
    video: undefined,
    files: [],
    imagesDraft: [],
    count: 0,
    currentSettings: {
      important: {
        active: false,
        expires_time: null,
      },
    },
    initAudiences: null,
    isSavingDraftPost: false,
  },
  createComment: {
    loading: false,
    content: '',
    image: undefined,
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
  scrollToLatestItem: null,
  scrollToCommentsPosition: null,
  postSelectAudienceState: {
    loading: true,
    selectingAudiences: [],
    selectingGroups: {},
    selectingUsers: {},
  },
  loadingGetPostDetail: false,
  commentErrorCode: '',
  seenPostList: {
    loading: false,
    data: [],
    canLoadMore: true,
    total: 0,
  },
  allPostContainingVideoInProgress: {
    total: 0,
    data: [],
  },
};

function postReducer(state = postInitState, action: any = {}) {
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
        draftPosts: payload || postInitState.draftPosts,
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
        createPost: postInitState.createPost,
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
    case postTypes.SET_CREATE_POST_CURRENT_SETTINGS:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          currentSettings: {
            ...state?.createPost?.currentSettings,
            ...payload,
          },
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
    case postTypes.SET_CREATE_POST_INIT_AUDIENCES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          initAudiences: payload,
        },
      };
    case postTypes.SET_CREATE_POST_IMPORTANT:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          important: payload || postInitState.createPost.important,
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
    case postTypes.SET_CREATE_POST_VIDEO:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          video: payload,
        },
      };
    case postTypes.SET_CREATE_POST_FILES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          files: payload || [],
        },
      };
    case postTypes.ADD_CREATE_POST_FILES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          files: [...state.createPost.files, ...payload],
        },
      };
    case postTypes.SET_CREATE_POST_FILE: {
      const filename = payload?.name || payload?.filename || payload?.fileName;

      return {
        ...state,
        createPost: {
          ...state.createPost,
          files: state.createPost.files.map((file: IFilePicked) =>
            file.name === filename ? payload : file,
          ),
        },
      };
    }
    case postTypes.REMOVE_CREATE_POST_FILE: {
      let name = payload.name;
      if (!name) name = payload.fileName;

      return {
        ...state,
        createPost: {
          ...state.createPost,
          files: state.createPost.files.filter((file: IFilePicked) => {
            let itemName = file.name;
            if (!itemName) itemName = file.fileName;

            return itemName !== name;
          }),
        },
      };
    }
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
    case postTypes.SET_SAVING_DRAFT_POST:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          isSavingDraftPost: payload,
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
        postAudienceSheet: postInitState.postAudienceSheet,
      };
    case postTypes.SET_ALL_COMMENTS_BY_PARENT_IDS:
      return {
        ...state,
        allCommentsByParentIds: payload,
        loadingGetPostDetail: false,
      };
    case postTypes.SET_SCROLL_TO_LATEST_ITEM:
      return {
        ...state,
        scrollToLatestItem: payload,
      };
    case postTypes.UPDATE_COMMENT_API: {
      // update pre-comment with data receiving from API
      const {status, localId, postId, resultComment, parentCommentId} = payload;
      const allCommentsByPost: any = {...state.allCommentsByParentIds};
      const postComments = [...allCommentsByPost[postId]];
      let comment;

      if (parentCommentId) {
        // find parent comment
        const parentCommentPosition = postComments.findIndex(
          (item: ICommentData) => item.id === parentCommentId,
        );
        // find and update target reply comment
        const child = postComments[parentCommentPosition].child.list || [];
        const targetPosition = child.findIndex(
          (item: ICommentData) => item?.localId === localId,
        );
        comment = {
          ...child[targetPosition],
          ...resultComment,
          status,
        };
        child[targetPosition] = comment;
      } else {
        const position = postComments.findIndex(
          (item: ICommentData) => item?.localId === localId,
        );
        comment = {...postComments[position], ...resultComment, status};
        postComments[position] = comment;
      }

      allCommentsByPost[postId] = postComments;
      return {
        ...state,
        allCommentsByParentIds: allCommentsByPost,
      };
    }
    case postTypes.POST_CANCEL_FAILED_COMMENT: {
      // find and remove target reply comment
      const {localId, parentCommentId, postId} = payload;
      const allCommentsByPost: any = {...state.allCommentsByParentIds};
      const postComments = [...allCommentsByPost?.[postId]];

      if (parentCommentId) {
        // find parent comment
        const parentCommentPosition = postComments.findIndex(
          (item: ICommentData) => item.id === parentCommentId,
        );
        const child = postComments[parentCommentPosition].child || [];
        const targetPosition = child.findIndex(
          (item: ICommentData) => item?.localId === localId,
        );
        child.splice(targetPosition, 1);
      } else {
        const position = postComments.findIndex(
          (item: ICommentData) => item?.localId === localId,
        );
        postComments.splice(position, 1);
      }

      allCommentsByPost[postId] = postComments;
      return {
        ...state,
        allCommentsByParentIds: allCommentsByPost,
      };
    }
    case postTypes.SET_SHOW_REACTION_BOTTOM_SHEET:
      return {
        ...state,
        reactionBottomSheet: payload || postInitState.reactionBottomSheet,
      };
    case postTypes.SET_USERS_SEEN_POST:
      return {
        ...state,
        seenPostList: payload || postInitState.seenPostList,
      };
    case postTypes.SET_POST_SELECT_AUDIENCE_STATE:
      return {
        ...state,
        postSelectAudienceState: payload
          ? {...state.postSelectAudienceState, ...payload}
          : postInitState.postSelectAudienceState,
      };
    case postTypes.SET_SCROLL_TO_COMMENTS_POSITION:
      return {
        ...state,
        scrollToCommentsPosition: payload,
      };
    case postTypes.LOADING_GET_POST_DETAIL:
      return {
        ...state,
        loadingGetPostDetail: payload,
      };
    case postTypes.SET_COMMENT_ERROR_CODE:
      return {
        ...state,
        commentErrorCode: payload,
      };
    case postTypes.REMOVE_CHILD_COMMENT: {
      const allCommentsByPost: any = {...state.allCommentsByParentIds};

      // eslint-disable-next-line no-case-declarations
      const {localId, postId, parentCommentId} = payload || {};
      // eslint-disable-next-line no-case-declarations
      const postComments = [...allCommentsByPost[postId]];

      if (parentCommentId) {
        // find parent comment
        const pIndex = postComments.findIndex(
          (item: ICommentData) => item.id === parentCommentId,
        );

        // find and update target reply comment
        if (postComments?.[pIndex]?.child?.list) {
          postComments[pIndex].child = {
            list: postComments[pIndex].child.list?.filter?.(
              (cmt: ICommentData) => cmt?.localId !== localId,
            ),
          };
        }
        if (postComments?.[pIndex]?.totalReply) {
          postComments[pIndex].totalReply = Math.max(
            (postComments[pIndex].totalReply || 0) - 1,
            0,
          );
        }
      }
      allCommentsByPost[postId] = postComments;

      return {
        ...state,
        allCommentsByParentIds: allCommentsByPost,
      };
    }
    case postTypes.REMOVE_COMMENT_DELETED: {
      const allCommentsByPost: any = {...state.allCommentsByParentIds};
      const newAllPosts: any = {...state.allPosts};
      const {postId, commentId, localId} = payload || {};

      const deleteCommentPost = {...newAllPosts[postId]};
      const postComments = [...allCommentsByPost[postId]];
      if (commentId && postComments) {
        const pIndexCommentNeedDelete = postComments.findIndex(
          (item: ICommentData) => item.id === commentId,
        );

        deleteCommentPost.commentsCount = Math.max(
          0,
          (deleteCommentPost.commentsCount || 0) -
            1 -
            postComments[pIndexCommentNeedDelete].totalReply,
        );

        const newPostComments = postComments?.filter?.(
          (cmt: ICommentData) => cmt.id !== commentId,
        );
        newAllPosts[postId] = {...deleteCommentPost};
        allCommentsByPost[postId] = newPostComments;
      } else if (localId && postComments) {
        const pIndexCommentNeedDelete = postComments.findIndex(
          (item: ICommentData) => item.localId === localId,
        );

        deleteCommentPost.commentsCount = Math.max(
          0,
          (deleteCommentPost.commentsCount || 0) -
            1 -
            postComments[pIndexCommentNeedDelete].totalReply,
        );

        const newPostComments = postComments?.filter?.(
          (cmt: ICommentData) => cmt.localId !== localId,
        );
        newAllPosts[postId] = {...deleteCommentPost};
        allCommentsByPost[postId] = newPostComments;
      }
      return {
        ...state,
        allCommentsByParentIds: allCommentsByPost,
        allPosts: newAllPosts,
      };
    }
    case postTypes.SET_POSTS_CONTAINING_VIDEO_IN_PROGRESS: {
      const newAllPostContainingVideoInProgress = {
        total: payload?.total || 0,
        data: payload?.data || [],
      };
      console.log('postTypes.SET_POSTS_CONTAINING_VIDEO_IN_PROGRESS', payload);

      return {
        ...state,
        allPostContainingVideoInProgress: {
          ...newAllPostContainingVideoInProgress,
        },
      };
    }

    default:
      return state;
  }
}

export default postReducer;
