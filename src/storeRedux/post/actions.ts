import postTypes from './types';
import {
  IPayloadReplying,
  IPayloadGetPostDetail,
  IPayloadRemoveAudiencesOfPost,
} from '~/interfaces/IPost';

const postActions = {
  // post detail
  setPostDetailReplyingComment: (payload?: IPayloadReplying) => ({
    type: postTypes.SET_POST_DETAIL_REPLYING_COMMENT,
    payload,
  }),
  // saga
  setScrollToLatestItem: (payload: null | {parentCommentId?: string | number}) => ({
    type: postTypes.SET_SCROLL_TO_LATEST_ITEM,
    payload,
  }),
  getPostDetail: (payload: IPayloadGetPostDetail) => ({
    type: postTypes.GET_POST_DETAIL,
    payload,
  }),
  setScrollCommentsPosition: (payload: null | {position?: string}) => ({
    type: postTypes.SET_SCROLL_TO_COMMENTS_POSITION,
    payload,
  }),
  setLoadingGetPostDetail: (payload: boolean) => ({
    type: postTypes.LOADING_GET_POST_DETAIL,
    payload,
  }),
  setCommentErrorCode: (payload: boolean | string) => ({
    type: postTypes.SET_COMMENT_ERROR_CODE,
    payload,
  }),
  removePostAudiences: (payload:IPayloadRemoveAudiencesOfPost) => ({
    type: postTypes.REMOVE_POST_AUDIENCES,
    payload,
  }),
};

export default postActions;
