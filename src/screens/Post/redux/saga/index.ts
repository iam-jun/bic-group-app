import {put, call, takeLatest, select, takeEvery} from 'redux-saga/effects';
import {isArray, get} from 'lodash';

import {
  IOwnReaction,
  IParamGetPostAudiences,
  IParamGetPostDetail,
  IPayloadCreateComment,
  IPayloadCreatePost,
  IPayloadDeletePost,
  IPayloadGetCommentsById,
  IPayloadGetDraftPosts,
  IPayloadGetPostDetail,
  IPayloadPublishDraftPost,
  IPayloadPutEditComment,
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
import getCommentsByPostId from '~/screens/Post/redux/saga/getCommentsByPostId';

const navigation = withNavigation(rootNavigationRef);

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

function* putEditComment({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditComment;
}) {
  const {id, comment, data} = payload;
  if (!id || !data || !comment) {
    console.log(`\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m`);
    return;
  }
  try {
    yield put(postActions.setCreateComment({loading: true}));

    yield postDataHelper.putEditComment(id, data);

    const newComment = {...comment};
    newComment.data = Object.assign({}, newComment.data, data, {edited: true});
    newComment.updated_at = new Date().toISOString();
    yield put(postActions.addToAllComments(newComment));
    yield put(
      modalActions.showHideToastMessage({
        content: 'post:edit_comment_success',
        props: {textProps: {useI18n: true}, type: 'success'},
      }),
    );
    yield timeOut(500);
    navigation.goBack();
    yield put(postActions.setCreateComment({loading: false, content: ''}));
  } catch (e) {
    yield put(postActions.setCreateComment({loading: false}));
    yield showError(e);
  }
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

function* onUpdateReactionOfPostById(
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
  reactionsOrder?: string[],
): any {
  try {
    const post = yield select(state =>
      get(state, postKeySelector.postById(postId)),
    );
    post.reaction_counts = reactionCounts;
    post.own_reactions = ownReaction;
    post.reactions_order = reactionsOrder || [];
    yield put(postActions.addToAllPosts({data: post}));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* putReactionToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const post1 = yield select(s => get(s, postKeySelector.postById(id)));
    const cReactionCounts1 = post1.reaction_counts || {};
    const cOwnReaction1 = post1.own_reactions || {};
    const cReactionsOrder = post1.reactions_order || [];

    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = cOwnReaction1?.[reactionId]?.length > 0;
    if (!added) {
      const newOwnReaction1: IOwnReaction = {...cOwnReaction1};
      const reactionArr: IReaction[] = [];
      reactionArr.push({loading: true});
      newOwnReaction1[reactionId] = reactionArr;
      const newReactionCounts = {...cReactionCounts1};
      newReactionCounts[reactionId] =
        (newReactionCounts?.[reactionId] || 0) + 1;
      yield onUpdateReactionOfPostById(
        id,
        newOwnReaction1,
        newReactionCounts,
        cReactionsOrder,
      );

      yield postDataHelper.putReactionToPost({postId: id, data});
      // Disable update data base on response because of calculate wrong value when receive socket msg
      // if (response?.data?.[0]) {
      //   const post2 = yield select(s => get(s, postKeySelector.postById(id)));
      //   const cReactionCounts2 = post2.reaction_counts || {};
      //   const cOwnReaction2 = post2.own_reactions || {};
      //   const newOwnReaction2: IOwnReaction = {...cOwnReaction2};
      //
      //   const reactionArr2: IReaction[] = [];
      //   reactionArr2.push({id: response?.data?.[0]?.id});
      //   newOwnReaction2[reactionId] = reactionArr2;
      //
      //   yield onUpdateReactionOfPostById(
      //     id,
      //     {...newOwnReaction2},
      //     {...cReactionCounts2},
      //   );
      // }
    }
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    // yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts);
    yield showError(e);
  }
}

function* deleteReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  const post1 = yield select(s => get(s, postKeySelector.postById(id)));
  const cReactionsOrder = post1?.reactions_order || [];
  try {
    const cReactionCounts1 = post1.reaction_counts || {};
    const cOwnReaction1 = post1.own_reactions || {};
    const rId = cOwnReaction1?.[reactionId]?.[0]?.id;
    if (rId) {
      const newOwnReaction1: IOwnReaction = {...cOwnReaction1};
      const reactionArr: IReaction[] = [];
      reactionArr.push({loading: true});
      newOwnReaction1[reactionId] = reactionArr;
      yield onUpdateReactionOfPostById(
        id,
        newOwnReaction1,
        {...cReactionCounts1},
        cReactionsOrder,
      );

      yield call(postDataHelper.deleteReaction, rId);

      const post2 = yield select(s => get(s, postKeySelector.postById(id)));
      const cReactionCounts2 = post2.reaction_counts || {};
      const cOwnReaction2 = post2.own_reactions || {};
      const newOwnReaction2 = {...cOwnReaction2};
      newOwnReaction2[reactionId] = [];
      const newReactionCounts2 = {...cReactionCounts2};
      newReactionCounts2[reactionId] = Math.max(
        0,
        (newReactionCounts2[reactionId] || 0) - 1,
      );
      yield onUpdateReactionOfPostById(
        id,
        newOwnReaction2,
        newReactionCounts2,
        cReactionsOrder,
      );
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(
      id,
      ownReaction,
      reactionCounts,
      cReactionsOrder,
    ); //rollback
    yield showError(e);
  }
}

function* onUpdateReactionOfCommentById(
  commentId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
  defaultComment?: IReaction,
  reactionsOrder?: string[],
): any {
  try {
    const allComments = yield select(state =>
      get(state, postKeySelector.allComments),
    ) || {};
    const comment: IReaction = allComments?.[commentId] || defaultComment || {};
    const newComment = {...comment};
    newComment.children_counts = reactionCounts;
    newComment.own_children = ownReaction;
    newComment.reactions_order = reactionsOrder;
    allComments[commentId] = newComment;
    yield put(postActions.setAllComments(allComments));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* updateReactionBySocket({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateReaction;
}): any {
  const {userId, data} = payload || {};
  const {actor, reaction, post, comment} = data as ISocketReaction;

  const isCurrentUser = userId == actor?.id;

  if (comment?.comment_id) {
    const {
      comment_id = '',
      reaction_counts = {},
      reactions_order = [],
    } = comment || {};
    // handle reaction to comment
    // merge own children if reaction's actor is current user
    const c =
      (yield select(s => get(s, postKeySelector.commentById(comment_id)))) ||
      {};
    const ownReactions = {...c.own_children};
    if (isCurrentUser && reaction?.kind) {
      ownReactions[reaction.kind] = [reaction];
    }
    yield onUpdateReactionOfCommentById(
      comment_id,
      ownReactions,
      reaction_counts,
      undefined,
      reactions_order,
    );
  } else if (post?.post_id) {
    const {
      post_id = '',
      reaction_counts = {},
      reactions_order = [],
    } = post || {};
    // handle reaction to post
    // merge own reaction if reaction's actor is current user
    const p =
      (yield select(state => get(state, postKeySelector.postById(post_id)))) ||
      {};
    const ownReactions = {...p.own_reactions};
    if (isCurrentUser && reaction?.kind) {
      ownReactions[reaction.kind] = [reaction];
    }
    yield onUpdateReactionOfPostById(
      post_id,
      ownReactions,
      reaction_counts,
      reactions_order,
    );
  }
}

function* updateUnReactionBySocket({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateReaction;
}): any {
  const {userId, data} = payload || {};
  const {actor, post, comment, reaction} = (data as ISocketReaction) || {};

  const isCurrentUser = userId == actor?.id;

  if (comment?.comment_id) {
    // handle un-react comment
    const {
      comment_id,
      reaction_counts = {},
      reactions_order = [],
    } = comment || {};
    const c =
      (yield select(s => get(s, postKeySelector.commentById(comment_id)))) ||
      {};
    const ownReactions = {...c.own_children};
    if (isCurrentUser && reaction?.kind) {
      ownReactions[reaction.kind] = [];
    }
    yield onUpdateReactionOfCommentById(
      comment?.comment_id,
      ownReactions,
      reaction_counts,
      undefined,
      reactions_order,
    );
  } else if (post?.post_id) {
    const {post_id, reaction_counts = {}, reactions_order = []} = post;
    // handle un-react post
    const p =
      (yield select(state => get(state, postKeySelector.postById(post_id)))) ||
      {};
    const ownReactions = {...p.own_reactions};
    if (isCurrentUser && reaction?.kind) {
      ownReactions[reaction.kind] = [];
    }
    yield onUpdateReactionOfPostById(
      post_id,
      ownReactions,
      reaction_counts,
      reactions_order,
    );
  }
}

function* putReactionToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}): any {
  const {
    id,
    comment,
    postId,
    parentCommentId,
    reactionId,
    reactionCounts,
    ownReaction,
  } = payload;
  const isChildComment = !!parentCommentId;
  if (!postId) {
    console.log(
      `\x1b[31m🐣️ saga putReactionToComment: postId not found\x1b[0m`,
    );
    return;
  }
  try {
    const cComment1 =
      (yield select(s => get(s, postKeySelector.commentById(id)))) || comment;
    const cReactionCount1 = cComment1.children_counts || {};
    const cOwnReactions1 = cComment1.own_children || {};
    const cReactionsOrder1 = cComment1.reactions_order || [];

    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = cOwnReactions1?.[reactionId]?.length > 0;
    if (!added) {
      const newOwnChildren1 = {...cOwnReactions1};
      const reactionArr: IReaction[] = [];
      reactionArr.push({loading: true});
      newOwnChildren1[reactionId] = reactionArr;
      const newChildrenCounts1 = {...cReactionCount1};
      newChildrenCounts1[reactionId] =
        (newChildrenCounts1[reactionId] || 0) + 1;
      yield onUpdateReactionOfCommentById(
        id,
        newOwnChildren1,
        newChildrenCounts1,
        comment,
        cReactionsOrder1,
      );

      yield postDataHelper.putReactionToComment({commentId: id, data});
      // Disable update data base on response because of calculate wrong value when receive socket msg
      // if (response?.data?.[0]) {
      //   const cComment2 =
      //     (yield select(s => get(s, postKeySelector.commentById(id)))) ||
      //     comment;
      //   const cReactionCount2 = cComment2.children_counts || {};
      //   const cOwnReactions2 = cComment2.own_children || {};
      //   const newOwnChildren2 = {...cOwnReactions2};
      //   const reactionArr2: IReaction[] = [];
      //   reactionArr2.push({id: response?.data?.[0]?.id});
      //   newOwnChildren2[reactionId] = reactionArr2;
      //   yield onUpdateReactionOfCommentById(
      //     id,
      //     newOwnChildren2,
      //     {...cReactionCount2},
      //     comment,
      //   );
      // }
    }
  } catch (e) {
    // disable rollback in case limit 21 reaction
    // yield onUpdateReactionOfCommentById(
    //   id,
    //   ownReaction,
    //   reactionCounts,
    //   comment,
    // );
    yield showError(e);
  }
}

function* deleteReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}): any {
  const {id, comment, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const rId = ownReaction?.[reactionId]?.[0]?.id;
    if (rId) {
      const cComment1 = yield select(s =>
        get(s, postKeySelector.commentById(id)),
      ) || {};
      const cReactionCount1 = cComment1.children_counts || {};
      const cOwnReactions1 = cComment1.own_children || {};
      const cReactionsOrder1 = cComment1.reactions_order || {};

      const newOwnChildren1 = {...cOwnReactions1};
      const reactionArr: IReaction[] = [];
      reactionArr.push({loading: true});
      newOwnChildren1[reactionId] = reactionArr;
      yield onUpdateReactionOfCommentById(
        id,
        newOwnChildren1,
        {...cReactionCount1},
        comment,
        cReactionsOrder1,
      );

      yield call(postDataHelper.deleteReaction, rId);

      const cComment2 = yield select(s =>
        get(s, postKeySelector.commentById(id)),
      ) || {};
      const cReactionCount2 = cComment2.children_counts || {};
      const cOwnReactions2 = cComment2.own_children || {};
      const cReactionsOrder2 = cComment2.reactions_order || {};

      const newChildrenCounts2 = {...cReactionCount2};
      newChildrenCounts2[reactionId] = Math.max(
        0,
        (newChildrenCounts2[reactionId] || 0) - 1,
      );
      const newOwnChildren2 = {...cOwnReactions2};
      newOwnChildren2[reactionId] = [];
      yield onUpdateReactionOfCommentById(
        id,
        newOwnChildren2,
        newChildrenCounts2,
        comment,
        cReactionsOrder2,
      );
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownReaction,
      reactionCounts,
      comment,
    );
    yield showError(e);
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
