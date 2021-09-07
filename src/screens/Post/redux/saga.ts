import {put, call, takeLatest, select, takeEvery} from 'redux-saga/effects';
import {isArray, get} from 'lodash';
import i18n from 'i18next';

import {
  IOwnReaction,
  IPayloadCreateComment,
  IPayloadGetCommentsById,
  IPayloadGetPostDetail,
  IPayloadPutEditComment,
  IPayloadPutEditPost,
  IPayloadReactToComment,
  IPayloadReactToPost,
  IPayloadUpdateCommentsById,
  IPostActivity,
  IPostCreatePost,
  IReaction,
  IReactionCounts,
  IRequestPostComment,
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

const navigation = withNavigation(rootNavigationRef);

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* postSaga() {
  yield takeLatest(postTypes.POST_CREATE_NEW_POST, postCreateNewPost);
  yield takeLatest(postTypes.POST_CREATE_NEW_COMMENT, postCreateNewComment);
  yield takeLatest(postTypes.PUT_EDIT_POST, putEditPost);
  yield takeLatest(postTypes.PUT_EDIT_COMMENT, putEditComment);
  yield takeLatest(postTypes.DELETE_POST, deletePost);
  yield takeLatest(postTypes.ADD_TO_ALL_POSTS, addToAllPosts);
  yield takeLatest(postTypes.ADD_TO_ALL_COMMENTS, addToAllComments);
  yield takeEvery(postTypes.POST_REACT_TO_POST, postReactToPost);
  yield takeEvery(postTypes.DELETE_REACT_TO_POST, deleteReactToPost);
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
  yield takeLatest(postTypes.GET_POST_DETAIL, getPostDetail);
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
    yield put(postActions.setLoadingCreatePost(false));
    yield showError(e);
  }
}

function* postCreateNewComment({
  payload,
}: {
  type: string;
  payload: IPayloadCreateComment;
}) {
  const {postId, parentCommentId, commentData, userId, onSuccess} =
    payload || {};
  if (!postId || !commentData || !userId) {
    console.log(`\x1b[31m🐣️ saga postCreateNewComment: invalid param\x1b[0m`);
    return;
  }
  try {
    yield put(postActions.setCreateComment({loading: true}));

    const requestData: IRequestPostComment = {
      referenceId: parentCommentId || postId,
      referenceType: parentCommentId ? 'comment' : 'post',
      commentData,
      userId: Number(userId),
    };
    const resComment = yield call(postDataHelper.postNewComment, requestData);

    //update comment_count
    const allPosts = yield select(state => state?.post?.allPosts) || {};
    const newAllPosts = {...allPosts};
    const post = newAllPosts[postId] || {};
    const newReactionCount = post.reaction_counts || {};
    newReactionCount.comment_count = (newReactionCount.comment_count || 0) + 1;
    post.reaction_counts = {...newReactionCount};
    newAllPosts[postId] = post;
    yield put(postActions.setAllPosts(newAllPosts));

    //update comments or child comments
    yield put(postActions.addToAllComments(resComment));
    if (!parentCommentId) {
      yield put(
        postActions.updateAllCommentsByParentIdsWithComments({
          id: postId,
          comments: new Array(resComment),
          isMerge: true,
        }),
      );
    } else {
      yield addChildCommentToCommentsOfPost({
        postId: postId,
        commentId: parentCommentId,
        childComments: new Array(resComment),
      });
    }

    yield put(postActions.setPostDetailReplyingComment());
    yield put(postActions.setCreateComment({loading: false, content: ''}));

    yield timeOut(800);
    onSuccess?.({newCommentId: resComment?.id, parentCommentId});
  } catch (e) {
    yield put(postActions.setCreateComment({loading: false}));
    yield showError(e);
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
    yield showError(e);
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

      yield put(
        modalActions.showHideToastMessage({
          content: 'post:delete_post_complete',
          props: {
            textProps: {variant: 'h6', useI18n: true},
            type: 'error',
          },
        }),
      );
    }
    console.log(`\x1b[35m🐣️ saga deletePost response`, response, `\x1b[0m`);
  } catch (e) {
    yield showError(e);
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

  let posts: IPostActivity[] = [];
  if (isArray(payload) && payload.length > 0) {
    posts = posts.concat(payload);
  } else {
    posts = new Array(payload) as IPostActivity[];
  }

  posts.map((item: IPostActivity) => {
    if (item?.id) {
      const postComments = sortComments(item?.latest_reactions?.comment || []);

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
    const post1 = yield select(s => get(s, postKeySelector.postById(id)));
    const cReactionCounts1 = post1.reaction_counts || {};
    const cOwnReaction1 = post1.own_reactions || {};

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
      yield onUpdateReactionOfPostById(id, newOwnReaction1, newReactionCounts);

      const response = yield call(
        postDataHelper.postReaction,
        id,
        'post',
        data,
        userId,
      );
      if (response?.data?.[0]) {
        const post2 = yield select(s => get(s, postKeySelector.postById(id)));
        const cReactionCounts2 = post2.reaction_counts || {};
        const cOwnReaction2 = post2.own_reactions || {};
        const newOwnReaction2: IOwnReaction = {...cOwnReaction2};

        const reactionArr2: IReaction[] = [];
        reactionArr2.push({id: response?.data?.[0]});
        newOwnReaction2[reactionId] = reactionArr2;

        yield onUpdateReactionOfPostById(
          id,
          {...newOwnReaction2},
          {...cReactionCounts2},
        );
      }
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    yield showError(e);
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
    const post1 = yield select(s => get(s, postKeySelector.postById(id)));
    const cReactionCounts1 = post1.reaction_counts || {};
    const cOwnReaction1 = post1.own_reactions || {};

    const rId = cOwnReaction1?.[reactionId]?.[0]?.id;
    if (rId) {
      const newOwnReaction1: IOwnReaction = {...cOwnReaction1};
      const reactionArr: IReaction[] = [];
      reactionArr.push({loading: true});
      newOwnReaction1[reactionId] = reactionArr;
      yield onUpdateReactionOfPostById(id, newOwnReaction1, {
        ...cReactionCounts1,
      });

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
      yield onUpdateReactionOfPostById(id, newOwnReaction2, newReactionCounts2);
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    yield showError(e);
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
    yield showError(e);
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
    yield showError(e);
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
  yield put(postActions.setAllCommentsByParentIds({...newData}));
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
  let newComments: IReaction[];
  if (isMerge) {
    newComments = [...new Set([...commentsById, ...comments])];
  } else {
    newComments = comments;
  }
  allComments[id] = sortComments(newComments);
  yield put(postActions.setAllCommentsByParentIds(allComments));
}

function* addChildCommentToCommentsOfPost({
  postId,
  commentId,
  childComments,
}: {
  postId: string;
  commentId: string;
  childComments: IReaction[];
}) {
  const postComments: IReaction[] = yield select(state =>
    get(state, postKeySelector.commentsByParentId(postId)),
  ) || [];
  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].id === commentId) {
      const latestChildren = postComments[i].latest_children || {};
      const oldChildComments = latestChildren.comment || [];
      const newChildComments = oldChildComments.concat(childComments) || [];
      latestChildren.comment = sortComments(newChildComments);
      postComments[i].latest_children = latestChildren;
      yield put(
        postActions.updateAllCommentsByParentIdsWithComments({
          id: postId,
          comments: new Array(postComments[i]),
          isMerge: true,
        }),
      );
      return;
    }
  }
}

function* getCommentsByPostId({
  payload,
}: {
  type: string;
  payload: IPayloadGetCommentsById;
}) {
  const {postId, commentId, isMerge, callbackLoading} = payload || {};
  try {
    callbackLoading?.(true);
    const response = yield call(postDataHelper.getCommentsByPostId, payload);
    callbackLoading?.(false);
    if (response?.length > 0) {
      if (commentId) {
        //get child comment of comment
        yield addChildCommentToCommentsOfPost({
          postId: postId,
          commentId: commentId,
          childComments: response,
        });
        yield put(postActions.addToAllComments(response));
      } else {
        //get comment of post
        const payload = {id: postId, comments: response, isMerge};
        const newAllComments: IReaction[] = [];
        response.map((c: IReaction) => getAllCommentsOfCmt(c, newAllComments));

        yield put(postActions.addToAllComments(newAllComments));
        yield put(
          postActions.updateAllCommentsByParentIdsWithComments(payload),
        );
      }
    }
  } catch (e) {
    console.log(
      `\x1b[34m🐣️ saga getCommentsById error:`,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
    callbackLoading?.(false);
    yield showError(e);
  }
}

function* getPostDetail({
  payload,
}: {
  type: string;
  payload: IPayloadGetPostDetail;
}) {
  const {userId, postId, streamClient, callbackLoading} = payload || {};
  if (!userId || !postId || !streamClient) {
    console.log(`\x1b[31m🐣️ saga getPostDetail invalid params\x1b[0m`);
    return;
  }
  try {
    callbackLoading?.(true);
    const response = yield call(
      postDataHelper.getPostDetail,
      userId,
      streamClient,
      postId,
    );
    yield put(postActions.addToAllPosts(response));
    callbackLoading?.(false);
  } catch (e) {
    callbackLoading?.(false);
    showError(e);
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

function* showError(e: any) {
  yield put(
    modalActions.showHideToastMessage({
      content:
        e?.meta?.message ||
        e?.meta?.errors?.[0]?.message ||
        'common:text_error_message',
      props: {
        textProps: {useI18n: true},
        type: 'error',
      },
    }),
  );
}
