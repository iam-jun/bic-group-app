import { isArray } from 'lodash';
import { ICommentData, IPayloadAddToAllPost, IPostActivity } from '~/interfaces/IPost';
import { sortComments } from '~/screens/post/helper/postUtils';
import useCommentsStore from '~/store/entities/comments';
import IPostsState from '../Interface';

const addToPosts = (_set, get) => (payload: IPayloadAddToAllPost) => {
  const { data, handleComment } = payload || {};
  const { posts, actions }:IPostsState = get();
  const newPosts = { ...posts };
  const newCommentsByParentId: any = {};
  let newComments: ICommentData[] = [];

  let postsToAdd: IPostActivity[] = [];
  if (isArray(data) && data.length > 0) {
    postsToAdd = postsToAdd.concat(data);
  } else {
    postsToAdd = new Array(data) as IPostActivity[];
  }

  postsToAdd.forEach((item: IPostActivity) => {
    if (item?.id) {
      if (handleComment) {
        const postComments = sortComments(item?.comments?.list || []);

        newCommentsByParentId[item.id] = postComments;
        postComments.forEach((c: ICommentData) => {
          newComments.push(c);
          newComments = newComments.concat(c?.child?.list || []);
        });
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
