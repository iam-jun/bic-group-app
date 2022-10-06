import { cloneDeep } from 'lodash';
import { IOwnReaction, IPayloadAddToAllPost, IReactionCounts } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

// eslint-disable-next-line require-yield
export default function* onUpdateReactionOfPostById(
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
): any {
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
}
