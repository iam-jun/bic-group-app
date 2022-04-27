import {put, call, takeLatest, select, takeEvery} from 'redux-saga/effects';
import {isArray, get} from 'lodash';

import {
  IOwnReaction,
  IParamGetPostAudiences,
  IParamGetPostDetail,
  IPayloadCreateComment,
  IPayloadCreatePost,
  IPayloadDeletePost,
  IPayloadGetDraftPosts,
  IPayloadGetPostDetail,
  IPayloadPublishDraftPost,
  IPayloadPutEditDraftPost,
  IPayloadReactToComment,
  IPayloadReactToPost,
  IPayloadUpdateCommentsById,
  IPayloadUpdateReaction,
  IPostActivity,
  IPostAudience,
  IReaction,
  IReactionCounts,
  ISocketReaction,
} from '~/interfaces/IPost';
import postTypes from '~/screens/Post/redux/types';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {withNavigation} from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ReactionType} from '~/constants/reactions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {sortComments} from '~/screens/Post/helper/PostUtils';
import homeActions from '~/screens/Home/redux/actions';
import groupsActions from '~/screens/Groups/redux/actions';
import deleteComment from './deleteComment';
import putEditPost from '~/screens/Post/redux/saga/putEditPost';
import getDraftPosts from './getDraftPosts';
import postCreateNewComment from '~/screens/Post/redux/saga/postCreateNewComment';
import showError from '~/store/commonSaga/showError';
import addToAllPosts from '~/screens/Post/redux/saga/addToAllPosts';
import putReactionToPost from './putReactionToPost';
import deleteReactToPost from './deleteReactToPost';
import putReactionToComment from './putReactionToComment';
import deleteReactToComment from './deleteReactToComment';
import updateReactionBySocket from './updateReactionBySocket';
import updateUnReactionBySocket from './updateUnReactionBySocket';
import getCommentsByPostId from '~/screens/Post/redux/saga/getCommentsByPostId';
import putEditComment from '~/screens/Post/redux/saga/putEditComment';
import {timeOut} from '~/utils/common';

const navigation = withNavigation(rootNavigationRef);

export default function* postSaga() {
  yield takeEvery(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
  yield takeEvery(postTypes.POST_CREATE_NEW_COMMENT, postCreateNewComment);
  yield takeLatest(postTypes.POST_RETRY_ADD_COMMENT, postRetryAddComment);
  yield takeLatest(postTypes.PUT_EDIT_POST, putEditPost);
  yield takeLatest(postTypes.PUT_EDIT_COMMENT, putEditComment);
  yield takeEvery(postTypes.DELETE_POST, deletePost);
  yield takeEvery(postTypes.DELETE_COMMENT, deleteComment);
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
  yield takeLatest(postTypes.ADD_TO_ALL_COMMENTS, addToAllComments);
  yield takeEvery(postTypes.POST_REACT_TO_POST, putReactionToPost);
  yield takeEvery(postTypes.DELETE_REACT_TO_POST, deleteReactToPost);
  yield takeEvery(postTypes.POST_REACT_TO_COMMENT, putReactionToComment);
  yield takeEvery(postTypes.DELETE_REACT_TO_COMMENT, deleteReactToComment);
  yield takeLatest(
    postTypes.SHOW_POST_AUDIENCES_BOTTOM_SHEET,
    showPostAudienceBottomSheet,
  );
  yield takeLatest(
    postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS,
    updateAllCommentsByParentIds,
  );
  yield takeLatest(
    postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS,
    updateAllCommentsByParentIdsWithComments,
  );
  yield takeLatest(postTypes.GET_COMMENTS_BY_POST_ID, getCommentsByPostId);
  yield takeLatest(postTypes.GET_POST_DETAIL, getPostDetail);
  yield takeEvery(postTypes.GET_DRAFT_POSTS, getDraftPosts);
  yield takeEvery(postTypes.POST_PUBLISH_DRAFT_POST, postPublishDraftPost);
  yield takeLatest(postTypes.PUT_EDIT_DRAFT_POST, putEditDraftPost);
  yield takeLatest(postTypes.UPDATE_REACTION_BY_SOCKET, updateReactionBySocket);
  yield takeLatest(
    postTypes.UPDATE_UN_REACTION_BY_SOCKET,
    updateUnReactionBySocket,
  );
  yield takeEvery(
    postTypes.GET_CREATE_POST_INIT_AUDIENCES,
    getCreatePostInitAudiences,
  );
}

function* postCreateNewPost({
  payload,
}: {
  type: string;
  payload: IPayloadCreatePost;
}): any {
  const {data, createFromGroupId} = payload || {};
  if (!data) {
    return;
  }
  try {
    const creatingPost = yield select(
      state => state?.post?.createPost?.loading,
    );
    if (creatingPost) {
      console.log(`\x1b[31m🐣️ saga postCreateNewPost: creating\x1b[0m`);
      return;
    }
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(postDataHelper.postCreateNewPost, data);
    if (response.data) {
      const postData: IPostActivity = response.data;
      yield put(postActions.addToAllPosts({data: postData}));

      if (data?.isDraft) {
        yield put(postActions.getDraftPosts({}));
      } else if (createFromGroupId) {
        yield put(groupsActions.clearGroupPosts());
        yield put(groupsActions.getGroupPosts(createFromGroupId));
      } else {
        yield put(homeActions.getHomePosts({isRefresh: true}));
      }

      yield timeOut(500);
      if (data?.isDraft) {
        yield put(
          modalActions.showHideToastMessage({
            content: 'post:draft:text_draft_saved',
            props: {textProps: {useI18n: true}, type: 'success'},
          }),
        );
        navigation?.goBack?.();
      } else {
        navigation.replace(homeStack.postDetail, {post_id: postData?.id});
      }
      yield timeOut(1000);
      yield put(postActions.setLoadingCreatePost(false));
    } else {
      //todo handle post error
      yield put(postActions.setLoadingCreatePost(false));
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    yield showError(e);
  }
}

function* postRetryAddComment({
  type,
  payload,
}: {
  type: string;
  payload: IReaction;
}) {
  const {activity_id, user_id, data, parentCommentId, localId} = payload;
  const currentComment: IPayloadCreateComment = {
    localId,
    // @ts-ignore
    postId: activity_id,
    parentCommentId,
    commentData: {
      content: data?.content,
      images: data?.images,
    },
    // @ts-ignore
    userId: user_id,
  };
  /**
   * preComment exists only when creating new comment from text input
   * when retrying, the preComment already exists in the data store
   * only need to update the data from API
   */
  yield postCreateNewComment({type, payload: currentComment});
}

function* deletePost({
  payload,
}: {
  type: string;
  payload: IPayloadDeletePost;
}): any {
  const {id, isDraftPost} = payload || {};
  if (!id) {
    console.log(`\x1b[31m🐣️ saga deletePost: id not found\x1b[0m`);
    return;
  }
  try {
    const response = yield postDataHelper.deletePost(id, isDraftPost);
    if (response?.data) {
      const post = yield select(state =>
        get(state, postKeySelector.postById(id)),
      );
      post.deleted = true;
      yield put(postActions.addToAllPosts({data: post}));
      yield timeOut(500);

      yield put(
        modalActions.showHideToastMessage({
          content: 'post:delete_post_complete',
          props: {
            textProps: {variant: 'h6', useI18n: true},
            type: 'success',
          },
        }),
      );
    }
    console.log(`\x1b[35m🐣️ saga deletePost response`, response, `\x1b[0m`);
  } catch (e) {
    yield showError(e);
  }
}

function* addToAllComments({
  payload,
}: {
  type: string;
  payload: IReaction[] | IReaction;
}): any {
  try {
    const allComments = yield select(state => state?.post?.allComments) || {};
    const newAllComments = {...allComments};
    if (isArray(payload) && payload.length > 0) {
      payload.map((item: IReaction) => {
        if (item?.id) {
          newAllComments[item.id] = item;
        }
      });
    } else if (payload && 'id' in payload && payload.id) {
      newAllComments[payload.id] = payload;
    }
    yield put(postActions.setAllComments(newAllComments));
  } catch (e) {
    console.log(
      `\x1b[31m🐣️ saga addToAllComments error:`,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
  }
}

function* showPostAudienceBottomSheet({
  payload,
}: {
  type: string;
  payload: {postId: string; fromStack?: any};
}): any {
  const {postId, fromStack} = payload;
  if (!postId) {
    console.log(`\x1b[31m🐣️saga showPostAudienceBottomSheet no postId\x1b[0m`);
  }
  const allPosts = yield select(state => state?.post?.allPosts) || {};
  const post: IPostActivity = allPosts?.[postId] || {};
  if (post) {
    yield put(
      postActions.setPostAudiencesBottomSheet({
        isShow: true,
        data: [],
        fromStack: fromStack,
      }),
    );

    const sectionList = [];
    const audience = post.audience;
    const {groups = [], users = []} = audience || {};

    //get groups
    const arrGroupIds: any = [];
    groups.map?.(group => arrGroupIds.push(group.id));
    if (arrGroupIds.length > 0) {
      const groupIds = arrGroupIds.join(',');
      const response = yield call(groupsDataHelper.getInfoGroups, groupIds);
      if (response?.data?.length > 0) {
        sectionList.push({title: 'Groups', data: response.data});
      }
    }

    if (users.length > 0) {
      const sectionUsers: any = [];
      users.map(user => {
        sectionUsers.push({
          id: user?.id,
          name: user?.data?.fullname,
          avatar: user?.data?.avatar,
          type: 'user',
        });
      });
      sectionList.push({title: 'Users', data: sectionUsers});
    }

    yield put(
      postActions.setPostAudiencesBottomSheet({
        isShow: true,
        data: sectionList,
        fromStack: fromStack,
      }),
    );
  } else {
    console.log(`\x1b[31m🐣️saga showPostAudienceSheet post not found\x1b[0m`);
  }
}

function* updateAllCommentsByParentIds({
  payload,
}: {
  type: string;
  payload: {[postId: string]: IReaction[]};
}): any {
  const allCommentsByParentIds = yield select(
    state => state?.post?.allCommentsByParentIds,
  ) || {};
  const newData = Object.assign({}, allCommentsByParentIds, payload);
  yield put(postActions.setAllCommentsByParentIds({...newData}));
}

function* updateAllCommentsByParentIdsWithComments({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateCommentsById;
}): any {
  const {id, comments, isMerge} = payload || {};
  const allComments = yield select(state =>
    get(state, postKeySelector.allCommentsByParentIds),
  ) || {};
  const commentsById = allComments[id] || [];
  let newComments: IReaction[];
  if (isMerge) {
    newComments = [...new Set([...commentsById, ...comments])];
  } else {
    newComments = comments;
  }
  allComments[id] = sortComments(newComments);
  yield put(postActions.setAllCommentsByParentIds(allComments));
}

function* postPublishDraftPost({
  payload,
}: {
  type: string;
  payload: IPayloadPublishDraftPost;
}): any {
  const {
    draftPostId,
    onSuccess,
    onError,
    replaceWithDetail,
    createFromGroupId,
  } = payload || {};
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const res = yield call(postDataHelper.postPublishDraftPost, draftPostId);
    yield put(postActions.setLoadingCreatePost(false));
    if (res.data) {
      onSuccess?.();
      const postData: IPostActivity = res.data;
      yield put(postActions.addToAllPosts({data: postData}));
      if (replaceWithDetail) {
        navigation.replace(homeStack.postDetail, {post_id: postData?.id});
      }
      if (createFromGroupId) {
        yield put(groupsActions.clearGroupPosts());
        yield put(groupsActions.getGroupPosts(createFromGroupId));
      }
      const payloadGetDraftPosts: IPayloadGetDraftPosts = {
        isRefresh: true,
      };
      yield put(homeActions.getHomePosts({isRefresh: true}));
      yield put(postActions.getDraftPosts(payloadGetDraftPosts));
    } else {
      onError?.();
      yield showError(res);
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    onError?.();
    yield showError(e);
  }
}

function* putEditDraftPost({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditDraftPost;
}): any {
  const {id, data, replaceWithDetail, publishNow, createFromGroupId} =
    payload || {};
  if (!id || !data) {
    console.log(`\x1b[31m🐣️ saga putEditDraftPost error\x1b[0m`);
    return;
  }

  try {
    yield put(postActions.setLoadingCreatePost(true));
    const isSavingDraftPost = yield select(
      state => state?.post?.createPost?.isSavingDraftPost,
    );
    if (isSavingDraftPost) {
      yield timeOut(300);
      yield put(postActions.putEditDraftPost(payload));
      return;
    }
    const response = yield postDataHelper.putEditPost({postId: id, data});
    if (response?.data) {
      if (publishNow) {
        const p: IPayloadPublishDraftPost = {
          draftPostId: id,
          replaceWithDetail: replaceWithDetail,
          refreshDraftPosts: true,
          createFromGroupId,
        };
        yield put(postActions.postPublishDraftPost(p));
      } else {
        yield put(postActions.setLoadingCreatePost(false));
        const payloadGetDraftPosts: IPayloadGetDraftPosts = {
          isRefresh: true,
        };
        yield put(postActions.getDraftPosts(payloadGetDraftPosts));
        navigation.goBack();
        yield put(
          modalActions.showHideToastMessage({
            content: 'post:draft:text_draft_saved',
            props: {textProps: {useI18n: true}, type: 'success'},
          }),
        );
      }
    } else {
      yield put(postActions.setLoadingCreatePost(false));
      yield showError(response);
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    yield showError(e);
  }
}

function* getPostDetail({
  payload,
}: {
  type: string;
  payload: IPayloadGetPostDetail;
}): any {
  const {callbackLoading, postId, ...restParams} = payload || {};
  if (!postId) {
    return;
  }
  try {
    callbackLoading?.(true, false);
    yield put(postActions.setLoadingGetPostDetail(true));
    const params: IParamGetPostDetail = {
      postId,
      //is_draft
      ...restParams,
    };
    const response = yield call(postDataHelper.getPostDetail, params);
    yield timeOut(500);
    yield put(postActions.addToAllPosts({data: response, handleComment: true}));
    callbackLoading?.(false, true);
  } catch (e: any) {
    yield timeOut(500);
    yield put(postActions.setLoadingGetPostDetail(false));
    callbackLoading?.(false, false);
    const post = yield select(state =>
      get(state, postKeySelector.postById(postId)),
    );
    if (post && e?.results?.length === 0) {
      post.deleted = true;
      yield put(postActions.addToAllPosts({data: post}));
    }
    yield showError(e);
  }
}

function* getCreatePostInitAudiences({
  payload,
}: {
  type: string;
  payload: IParamGetPostAudiences;
}): any {
  try {
    const response = yield postDataHelper.getPostAudience(payload);
    if (response?.data) {
      yield put(
        postActions.setCreatePostInitAudiences(response.data as IPostAudience),
      );
    }
  } catch (e: any) {
    console.log(`\x1b[31m🐣️ saga getCreatePostInitAudiences e:`, e, `\x1b[0m`);
  }
}
