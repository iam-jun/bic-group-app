/* eslint-disable no-unsafe-optional-chaining */
import { IFilePicked } from '~/interfaces/common';
import { ICommentData } from '~/interfaces/IPost';
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
    important: {
      active: false,
      expiresTime: null,
    },
    canComment: true,
    canReact: true,
    images: [],
    video: undefined,
    files: [],
    imagesDraft: [],
    count: 0,
    currentSettings: {
      important: {
        active: false,
        expiresTime: null,
      },
      canComment: true,
      canReact: true,
    },
    initAudiences: null,
    isSavingDraftPost: false,
    linkPreview: {
      lstLinkPreview: [],
      lstRemovedLinkPreview: [],
    },
  },
  reactionBottomSheet: {
    show: false,
    title: '',
    position: { x: -1, y: -1 },
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
  },
  loadingGetPostDetail: false,
  commentErrorCode: '',
  allPostContainingVideoInProgress: {
    total: 0,
    data: [],
  },
};

function postReducer(
  state = postInitState, action: any = {},
) {
  const { type, payload } = action;

  switch (type) {
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
          files: state.createPost.files
            .map((file: IFilePicked) => (file.name === filename ? payload : file)),
        },
      };
    }
    case postTypes.REMOVE_CREATE_POST_FILE: {
      let { name } = payload;
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
    case postTypes.SET_SCROLL_TO_LATEST_ITEM:
      return {
        ...state,
        scrollToLatestItem: payload,
      };
    case postTypes.SET_POST_SELECT_AUDIENCE_STATE:
      return {
        ...state,
        postSelectAudienceState: payload
          ? { ...state.postSelectAudienceState, ...payload }
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
      const allCommentsByPost: any = { ...state.allCommentsByParentIds };

      // eslint-disable-next-line no-case-declarations
      const { localId, postId, parentCommentId } = payload || {};
      // eslint-disable-next-line no-case-declarations
      const postComments = [...allCommentsByPost[postId]];

      if (parentCommentId) {
        // find parent comment
        const pIndex = postComments.findIndex((item: ICommentData) => item.id === parentCommentId);

        // find and update target reply comment
        if (postComments?.[pIndex]?.child?.list) {
          postComments[pIndex].child = {
            list: postComments[pIndex].child.list?.filter?.((cmt: ICommentData) => cmt?.localId !== localId),
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
      const allCommentsByPost: any = { ...state.allCommentsByParentIds };
      const newAllPosts: any = { ...state.allPosts };
      const { postId, commentId, localId } = payload || {};

      const deleteCommentPost = { ...newAllPosts[postId] };
      const postComments = [...allCommentsByPost[postId]];
      if (commentId && postComments) {
        const pIndexCommentNeedDelete = postComments.findIndex((item: ICommentData) => item.id === commentId);

        deleteCommentPost.commentsCount = Math.max(
          0,
          (deleteCommentPost.commentsCount || 0)
            - 1
            - postComments[pIndexCommentNeedDelete].totalReply,
        );

        const newPostComments = postComments?.filter?.((cmt: ICommentData) => cmt.id !== commentId);
        newAllPosts[postId] = { ...deleteCommentPost };
        allCommentsByPost[postId] = newPostComments;
      } else if (localId && postComments) {
        const pIndexCommentNeedDelete = postComments.findIndex((item: ICommentData) => item.localId === localId);

        deleteCommentPost.commentsCount = Math.max(
          0,
          (deleteCommentPost.commentsCount || 0)
            - 1
            - postComments[pIndexCommentNeedDelete].totalReply,
        );

        const newPostComments = postComments?.filter?.((cmt: ICommentData) => cmt.localId !== localId);
        newAllPosts[postId] = { ...deleteCommentPost };
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
        data:
          payload?.data || state.allPostContainingVideoInProgress?.data || [],
      };
      return {
        ...state,
        allPostContainingVideoInProgress: {
          ...newAllPostContainingVideoInProgress,
        },
      };
    }
    case postTypes.UPDATE_LINK_PREVIEW:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          linkPreview: {
            ...state.createPost.linkPreview,
            ...payload,
          },
        },
      };

    default:
      return state;
  }
}

export default postReducer;
