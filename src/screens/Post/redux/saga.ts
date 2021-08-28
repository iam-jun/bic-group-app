import {put, call, takeLatest, select} from 'redux-saga/effects';
import {isArray, get} from 'lodash';
import i18n from 'i18next';

import {
  IOwnReaction,
  IParamSearchMentionAudiences,
  IPayloadGetCommentsById,
  IPayloadPutEditComment,
  IPayloadPutEditPost,
  IPayloadReactToComment,
  IPayloadReactToPost,
  IPayloadUpdateCommentsById,
  IPostActivity,
  IPostCreatePost,
  IReaction,
  IReactionCounts,
} from '~/interfaces/IPost';
import postTypes from '~/screens/Post/redux/types';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {withNavigation} from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ReactionType} from '~/constants/reactions';
import {showHeaderFlashMessage} from '~/store/app/actions';
import {IHeaderFlashMessage} from '~/interfaces/common';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {sortComments} from '~/screens/Post/helper/PostUtils';

const navigation = withNavigation(rootNavigationRef);

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* postSaga() {
  yield takeLatest(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
  yield takeLatest(postTypes.PUT_EDIT_POST, putEditPost);
  yield takeLatest(postTypes.PUT_EDIT_COMMENT, putEditComment);
  yield takeLatest(postTypes.DELETE_POST, deletePost);
  yield takeLatest(
    postTypes.GET_SEARCH_MENTION_AUDIENCES,
    getSearchMentionAudiences,
  );
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
  yield takeLatest(postTypes.ADD_TO_ALL_COMMENTS, addToAllComments);
  yield takeLatest(postTypes.POST_REACT_TO_POST, postReactToPost);
  yield takeLatest(postTypes.DELETE_REACT_TO_POST, deleteReactToPost);
  yield takeLatest(postTypes.POST_REACT_TO_COMMENT, postReactToComment);
  yield takeLatest(postTypes.DELETE_REACT_TO_COMMENT, deleteReactToComment);
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
}

function* postCreateNewPost({
  payload,
}: {
  type: string;
  payload: IPostCreatePost;
}) {
  console.log(
    '\x1b[36m',
    'namanh --- postCreateNewPost | postCreateNewPost : ',
    '\x1b[0m',
    payload,
  );
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(postDataHelper.postCreateNewPost, payload);
    yield put(postActions.setLoadingCreatePost(false));
    if (response.data) {
      const postData: IPostActivity = response.data;
      yield put(postActions.addToAllPosts(postData));
      yield put(postActions.setPostDetail(postData));
      navigation.replace(homeStack.postDetail);
    } else {
      //todo handle post error
    }
  } catch (e) {
    console.log(
      '\x1b[33m',
      'namanh --- postCreateNewPost | postCreateNewPost catch: ',
      JSON.stringify(e, undefined, 2),
      '\x1b[0m',
    );
    yield put(postActions.setLoadingCreatePost(false));
    yield put(
      modalActions.showAlert({
        title: e?.meta?.errors?.[0]?.title || i18n.t('common:text_error'),
        content:
          e?.meta?.errors?.[0]?.message || i18n.t('common:text_error_message'),
        confirmLabel: i18n.t('common:text_ok'),
      }),
    );
  }
}

function* putEditPost({payload}: {type: string; payload: IPayloadPutEditPost}) {
  const {id, data, replaceWithDetail = true} = payload;
  if (!id || !data) {
    console.log(`\x1b[31m🐣️ saga putEditPost: id or data not found\x1b[0m`);
    return;
  }
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const response = yield call(postDataHelper.putEditPost, id, data);
    yield put(postActions.setLoadingCreatePost(false));
    if (response?.data) {
      const post = yield select(state =>
        get(state, postKeySelector.postById(id)),
      );
      if (post?.object) {
        post.object.data = data?.data || {};
      }
      //todo waiting for backend update response, replace whole object from response instead of local change
      yield put(postActions.addToAllPosts(post));
      if (replaceWithDetail) {
        yield put(postActions.setPostDetail(post));
        navigation.replace(homeStack.postDetail);
      } else {
        navigation.goBack();
      }
    }
  } catch (e) {
    console.log(
      `\x1b[31m🐣️ saga putEditPost error: `,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
  }
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
    newComment.data = Object.assign({}, newComment.data, data);
    yield put(postActions.addToAllComments(newComment));
    yield put(
      showHeaderFlashMessage({
        content: 'post:edit_comment_success',
        props: {textProps: {useI18n: true}, type: 'success'},
      }),
    );
    yield timeOut(500);
    navigation.goBack();
    yield put(postActions.setCreateComment({loading: false}));
  } catch (e) {
    console.log(
      `\x1b[31m🐣️ saga putEditComment error: `,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
    yield put(postActions.setCreateComment({loading: false}));
    modalActions.showAlert({
      title: e?.meta?.errors?.[0]?.title || i18n.t('common:text_error'),
      content:
        e?.meta?.errors?.[0]?.message || i18n.t('common:text_error_message'),
      confirmLabel: i18n.t('common:text_ok'),
    });
  }
}

function* deletePost({payload}: {type: string; payload: string}) {
  if (!payload) {
    console.log(`\x1b[31m🐣️ saga deletePost: id not found\x1b[0m`);
    return;
  }
  try {
    const response = yield call(postDataHelper.deletePost, payload);
    if (response?.data) {
      const post = yield select(state =>
        get(state, postKeySelector.postById(payload)),
      );
      post.deleted = true;
      yield put(postActions.addToAllPosts(post));
      yield timeOut(500);
      const flashMessage: IHeaderFlashMessage = {
        content: 'post:delete_post_complete',
        props: {
          textProps: {variant: 'h6', useI18n: true},
          type: 'error',
        },
      };
      yield put(showHeaderFlashMessage(flashMessage));
    }
    console.log(`\x1b[35m🐣️ saga deletePost response`, response, `\x1b[0m`);
  } catch (e) {
    console.log(`\x1b[35m🐣️ saga deletePost ${payload} failed`, e, `\x1b[0m`);
  }
}

function* getSearchMentionAudiences({
  payload,
}: {
  type: string;
  payload: IParamSearchMentionAudiences;
}) {
  try {
    const response = yield call(
      postDataHelper.getSearchMentionAudiences,
      payload,
    );
    if (response?.data) {
      yield put(postActions.setMentionSearchResult(response?.data));
    }
  } catch (e) {
    console.log('\x1b[36m', '🐣️ searchMentionAudiences error:', e, '\x1b[0m');
  }
}

function* addToAllPosts({
  payload,
}: {
  type: string;
  payload: IPostActivity[] | IPostActivity;
}) {
  const allPosts = yield select(state => state?.post?.allPosts) || {};
  const newAllPosts = {...allPosts};
  const newComments: IReaction[] = [];
  const newAllCommentByParentId: any = {};

  if (isArray(payload) && payload.length > 0) {
    payload.map((item: IPostActivity) => {
      if (item?.id) {
        const postComments = sortComments(
          item?.latest_reactions?.comment || [],
        );

        //todo update getstream query to get only 1 child comment
        //todo @Toan is researching for solution
        if (postComments.length > 0) {
          for (let i = 0; i < postComments.length; i++) {
            const cc = postComments[i]?.latest_children?.comment || [];
            if (cc.length > 1) {
              postComments[i].latest_children.comment = cc.slice(
                cc.length - 1,
                cc.length,
              );
            }
          }
        }
        //todo remove code above later

        newAllPosts[item.id] = item;
        newAllCommentByParentId[item.id] = postComments;
        postComments.map((c: IReaction) => getAllCommentsOfCmt(c, newComments));
      }
    });
  } else if (payload && 'id' in payload && payload.id) {
    const postComments = sortComments(payload?.latest_reactions?.comment || []);
    newAllPosts[payload.id] = payload;
    newAllCommentByParentId[payload.id] = postComments;
    postComments.map((c: IReaction) => getAllCommentsOfCmt(c, newComments));
  }

  yield put(postActions.addToAllComments(newComments));
  yield put(postActions.updateAllCommentsByParentIds(newAllCommentByParentId));
  yield put(postActions.setAllPosts(newAllPosts));
}

function* addToAllComments({
  payload,
}: {
  type: string;
  payload: IReaction[] | IReaction;
}) {
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
) {
  try {
    const post = yield select(state =>
      get(state, postKeySelector.postById(postId)),
    );
    post.reaction_counts = reactionCounts;
    post.own_reactions = ownReaction;
    yield put(postActions.addToAllPosts(post));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* postReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}) {
  const {id, reactionId, reactionCounts, ownReaction, userId} = payload;
  try {
    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = ownReaction?.[reactionId]?.length > 0;
    if (!added) {
      const newOwnReaction: IOwnReaction = {...ownReaction};
      const reactionArr: IReaction[] = [];
      reactionArr.push({kind: reactionId});
      newOwnReaction[reactionId] = reactionArr;
      const newReactionCounts = {...reactionCounts};
      newReactionCounts[reactionId] =
        (newReactionCounts?.[reactionId] || 0) + 1;
      yield onUpdateReactionOfPostById(id, newOwnReaction, newReactionCounts);

      const response = yield call(
        postDataHelper.postReaction,
        id,
        'post',
        data,
        userId,
      );
      if (response?.data?.[0]) {
        const reactionArr2: IReaction[] = [];
        reactionArr2.push({id: response?.data?.[0]});
        newOwnReaction[reactionId] = reactionArr2;

        yield onUpdateReactionOfPostById(id, newOwnReaction, newReactionCounts);
      }
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    console.log('\x1b[31m', '🐣️ postReactToPost error : ', e, '\x1b[0m');
  }
}

function* deleteReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}) {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const rId = ownReaction?.[reactionId]?.[0]?.id;
    if (rId) {
      const newOwnReaction = {...ownReaction};
      newOwnReaction[reactionId] = [];
      const newReactionCounts = {...reactionCounts};
      newReactionCounts[reactionId] = Math.max(
        0,
        (newReactionCounts[reactionId] || 0) - 1,
      );
      yield onUpdateReactionOfPostById(id, newOwnReaction, newReactionCounts);
      yield call(postDataHelper.deleteReaction, rId);
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    console.log(`\x1b[31m🐣️ deleteReactToPost : ${e}\x1b[0m`);
  }
}

function* onUpdateReactionOfCommentById(
  commentId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
  defaultComment: IReaction,
) {
  try {
    const allComments = yield select(state =>
      get(state, postKeySelector.allComments),
    ) || {};
    const comment: IReaction = allComments?.[commentId] || defaultComment || {};
    const newComment = {...comment};
    newComment.children_counts = reactionCounts;
    newComment.own_children = ownReaction;
    allComments[commentId] = newComment;
    yield put(postActions.setAllComments(allComments));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* postReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}) {
  const {
    id,
    comment,
    postId,
    parentCommentId,
    reactionId,
    reactionCounts,
    ownReaction,
    userId,
  } = payload;
  const isChildComment = !!parentCommentId;
  if (!postId) {
    console.log(`\x1b[31m🐣️ saga postReactToComment: postId not found\x1b[0m`);
    return;
  }
  try {
    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = ownReaction?.[reactionId]?.length > 0;
    if (!added) {
      const newChildrenCounts = {...reactionCounts};
      newChildrenCounts[reactionId] = (newChildrenCounts[reactionId] || 0) + 1;
      const newOwnChildren = {...ownReaction};
      const reactionArr: IReaction[] = [];
      reactionArr.push({kind: reactionId});
      newOwnChildren[reactionId] = reactionArr;
      yield onUpdateReactionOfCommentById(
        id,
        newOwnChildren,
        newChildrenCounts,
        comment,
      );

      const response = yield call(
        postDataHelper.postReaction,
        id,
        'comment',
        data,
        userId,
      );
      if (response?.data?.[0]) {
        const reactionArr2: IReaction[] = [];
        reactionArr2.push({id: response?.data?.[0]});
        newOwnChildren[reactionId] = reactionArr2;
        yield onUpdateReactionOfCommentById(
          id,
          newOwnChildren,
          newChildrenCounts,
          comment,
        );
      }
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownReaction,
      reactionCounts,
      comment,
    );
    console.log('\x1b[31m', '🐣️ postReactToPost error : ', e, '\x1b[0m');
  }
}

function* deleteReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}) {
  const {id, comment, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const rId = ownReaction?.[reactionId]?.[0]?.id;
    if (rId) {
      const newChildrenCounts = {...reactionCounts};
      newChildrenCounts[reactionId] = Math.max(
        0,
        (newChildrenCounts[reactionId] || 0) - 1,
      );
      const newOwnChildren = {...ownReaction};
      newOwnChildren[reactionId] = [];
      yield onUpdateReactionOfCommentById(
        id,
        newOwnChildren,
        newChildrenCounts,
        comment,
      );

      yield call(postDataHelper.deleteReaction, rId);
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownReaction,
      reactionCounts,
      comment,
    );
    console.log(`\x1b[31m🐣️ deleteReactToComment : ${e}\x1b[0m`);
  }
}

function* showPostAudienceBottomSheet({
  payload,
}: {
  type: string;
  payload: {postId: string; fromStack?: any};
}) {
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
}) {
  const allCommentsByParentIds = yield select(
    state => state?.post?.allCommentsByParentIds,
  ) || {};
  const newData = Object.assign({}, allCommentsByParentIds, payload);
  yield put(postActions.setAllCommentsByParentIds(newData));
}

function* updateAllCommentsByParentIdsWithComments({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateCommentsById;
}) {
  const {id, comments, isMerge} = payload || {};
  const allComments = yield select(state =>
    get(state, postKeySelector.allCommentsByParentIds),
  ) || {};
  const commentsById = allComments[id] || [];
  let newComments;
  if (isMerge) {
    newComments = commentsById.concat(comments);
  } else {
    newComments = comments;
  }
  allComments[id] = sortComments(newComments);
  yield put(postActions.setAllCommentsByParentIds(allComments));
}

function* getCommentsByPostId({
  payload,
}: {
  type: string;
  payload: IPayloadGetCommentsById;
}) {
  const {postId, isMerge, callbackLoading} = payload || {};
  try {
    callbackLoading?.(true);
    const response = yield call(postDataHelper.getCommentsByPostId, payload);
    callbackLoading?.(false);
    if (response?.length > 0) {
      const payload = {id: postId, comments: response, isMerge};
      const newAllComments: IReaction[] = [];
      response.map((c: IReaction) => getAllCommentsOfCmt(c, newAllComments));

      yield put(postActions.addToAllComments(newAllComments));
      yield put(postActions.updateAllCommentsByParentIdsWithComments(payload));
    }
  } catch (e) {
    console.log(
      `\x1b[34m🐣️ saga getCommentsById error:`,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
    yield put(
      modalActions.showAlert({
        title: e?.meta?.errors?.[0]?.title || i18n.t('common:text_error'),
        content:
          e?.meta?.errors?.[0]?.message || i18n.t('common:text_error_message'),
        confirmLabel: i18n.t('common:text_ok'),
      }),
    );
  }
}

const getAllCommentsOfCmt = (comment: IReaction, list: IReaction[]) => {
  if (comment && list) {
    list.push(comment);
    comment?.latest_children?.comment?.map((child: IReaction) =>
      list.push(child),
    );
  }
};
