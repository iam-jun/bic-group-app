/* eslint-disable no-unsafe-optional-chaining */
import postTypes from './types';

export const postInitState = {
  replyingComment: {},
  scrollToLatestItem: null,
  scrollToCommentsPosition: null,
  loadingGetPostDetail: false,
  commentErrorCode: '',
};

function postReducer(
  state = postInitState, action: any = {},
) {
  const { type, payload } = action;

  switch (type) {
    case postTypes.SET_POST_DETAIL_REPLYING_COMMENT:
      return {
        ...state,
        replyingComment: payload,
      };
    case postTypes.SET_SCROLL_TO_LATEST_ITEM:
      return {
        ...state,
        scrollToLatestItem: payload,
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

    default:
      return state;
  }
}

export default postReducer;
