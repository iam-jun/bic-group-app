import { isArray, isEmpty } from 'lodash';
import { ICommentData, IPayloadAddToAllPost, IPost } from '~/interfaces/IPost';
import { sortComments } from '~/helpers/post';
import useCommentsStore from '~/store/entities/comments';
import IPostsState from '../Interface';

const addToPosts = (_set, get) => (payload: IPayloadAddToAllPost) => {
  const { data, handleComment } = payload || {};
  const { posts, actions }:IPostsState = get();
  const newPosts = { ...posts };
  const newCommentsByParentId: any = {};
  let newComments: ICommentData[] = [];

  let postsToAdd: IPost[] = [];
  if (isArray(data) && data.length > 0) {
    postsToAdd = postsToAdd.concat(data);
  } else {
    postsToAdd = new Array(data) as IPost[];
  }

  postsToAdd.forEach((item: IPost) => {
    if (item?.id) {
      if (handleComment) {
        const postComments = sortComments(item?.comments?.list || []);
        const newPostCommentsId = [];
        postComments.forEach((c: ICommentData) => {
          newComments.push(c);
          newComments = newComments.concat(c?.child?.list || []);
          newPostCommentsId.push(c.id);
        });
        newCommentsByParentId[item.id] = newPostCommentsId;
      }

      // In timeline, BE can't get series because heavy query
      // in case go to article detail => press audience, open community timeline => back to article detail
      // series will be lost, so we have to keep series from previous data if new data is undefined
      const isPreviousDataHasSeries = !isEmpty(newPosts[item.id]?.series);
      if (isPreviousDataHasSeries && item.series === undefined) {
        item.series = newPosts[item.id]?.series;
      }

      newPosts[item.id] = item;
    }
  });
  if (handleComment) {
    useCommentsStore.getState().actions.addToComments(newComments);
    useCommentsStore.getState().actions.addToCommentsByParentId(newCommentsByParentId);
  }

  actions.setPosts(newPosts);
};

export default addToPosts;
