import {put, call, takeLatest, select} from 'redux-saga/effects';
import {isArray, get} from 'lodash';
import i18n from 'i18next';

import {
  IOwnReaction,
  IParamSearchMentionAudiences,
  IPayloadGetCommentsById,
  IPayloadPutEditPost,
  IPayloadReactToId,
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
  yield takeLatest(postTypes.DELETE_POST, deletePost);
  yield takeLatest(
    postTypes.GET_SEARCH_MENTION_AUDIENCES,
    getSearchMentionAudiences,
  );
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
  yield takeLatest(postTypes.POST_REACT_TO_POST, postReactToPost);
  yield takeLatest(postTypes.DELETE_REACT_TO_POST, deleteReactToPost);
  yield takeLatest(postTypes.POST_REACT_TO_COMMENT, postReactToComment);
  yield takeLatest(postTypes.DELETE_REACT_TO_COMMENT, deleteReactToComment);
  yield takeLatest(
    postTypes.SHOW_POST_AUDIENCES_BOTTOM_SHEET,
    showPostAudienceBottomSheet,
  );
  yield takeLatest(
    postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS,
    updateAllCommentsByParentIdsWithComments,
  );
  yield takeLatest(postTypes.GET_COMMENTS_BY_IDS, getCommentsById);
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
      const allPosts = yield select(state => state?.post?.allPosts) || {};
      const post: IPostActivity = allPosts?.[id] || {};
      if (post?.object) {
        post.object.data = data?.data || {};
      }
      //todo waiting for backend update response, replace whole object from response instead of local change
      allPosts[id] = post;
      yield put(postActions.setAllPosts(allPosts));
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

function* deletePost({payload}: {type: string; payload: string}) {
  if (!payload) {
    console.log(`\x1b[31m🐣️ saga deletePost: id not found\x1b[0m`);
    return;
  }
  try {
    const response = yield call(postDataHelper.deletePost, payload);
    if (response?.data) {
      const allPosts = yield select(state => state?.post?.allPosts) || {};
      const post: IPostActivity = allPosts?.[payload] || {};
      post.deleted = true;
      allPosts[payload] = post;
      yield put(postActions.setAllPosts(allPosts));
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
  if (isArray(payload) && payload.length > 0) {
    payload.map((item: IPostActivity) => {
      if (item?.id) {
        newAllPosts[item.id] = item;
      }
    });
  } else if (payload && 'id' in payload && payload.id) {
    newAllPosts[payload.id] = payload;
  }
  yield put(postActions.setAllPosts(newAllPosts));
}

function* onUpdateReactionOfPostById(
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
) {
  try {
    const allPosts = yield select(state => state?.post?.allPosts) || {};
    const post: IPostActivity = allPosts?.[postId] || {};
    post.reaction_counts = reactionCounts;
    post.own_reactions = ownReaction;
    allPosts[postId] = post;
    yield put(postActions.setAllPosts(allPosts));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}

function* postReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToId;
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
  payload: IPayloadReactToId;
}) {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const id = ownReaction?.[reactionId]?.[0]?.id;
    if (id) {
      const newOwnReaction = {...ownReaction};
      newOwnReaction[reactionId] = [];
      const newReactionCounts = {...reactionCounts};
      newReactionCounts[reactionId] = Math.max(
        0,
        (newReactionCounts[reactionId] || 0) - 1,
      );
      yield onUpdateReactionOfPostById(id, newOwnReaction, newReactionCounts);
      yield call(postDataHelper.deleteReaction, id);
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    console.log(`\x1b[31m🐣️ deleteReactToPost : ${e}\x1b[0m`);
  }
}

function* postReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToId;
}) {
  const {id, reactionId, reactionCounts, ownReaction, userId} = payload;
  try {
    const data: ReactionType[] = [];
    data.push(reactionId);
    const added = ownReaction?.[reactionId]?.length > 0;
    if (!added) {
      const response = yield call(
        postDataHelper.postReaction,
        id,
        'comment',
        data,
        userId,
      );
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    console.log('\x1b[31m', '🐣️ postReactToPost error : ', e, '\x1b[0m');
  }
}

function* deleteReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToId;
}) {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const id = ownReaction?.[reactionId]?.[0]?.id;
    if (id) {
      yield call(postDataHelper.deleteReaction, id);
    }
  } catch (e) {
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
          avatar: user?.data?.avatarUrl,
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

function* getCommentsById({
  payload,
}: {
  type: string;
  payload: IPayloadGetCommentsById;
}) {
  const {id, isMerge} = payload || {};
  try {
    const response = yield call(postDataHelper.getCommentsById, id);
    if (response?.length > 0) {
      const p = {id, comments: response, isMerge};
      yield put(postActions.updateAllCommentsByParentIdsWithComments(p));
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
