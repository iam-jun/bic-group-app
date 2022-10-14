import { cloneDeep } from 'lodash';
import { IOwnReaction, IPayloadAddToAllPost, IReactionCounts } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

const onUpdateReactionOfPostById = (_set, _get) => (
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
) => {
  try {
    const post = usePostsStore.getState()?.posts?.[postId] || {};
    if (post) {
      const newPost = cloneDeep(post);
      newPost.reactionsCount = reactionCounts;
      newPost.ownerReactions = ownReaction;
      usePostsStore.getState().actions.addToPosts({ data: newPost } as IPayloadAddToAllPost);
    }
  } catch (e) {
    console.error(
      '\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m',
    );
  }
};

export default onUpdateReactionOfPostById;
