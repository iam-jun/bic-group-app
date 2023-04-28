import { useCallback } from 'react';
import { ReactionType } from '~/constants/reactions';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  IOwnReaction, IPayloadReactToPost, IReactionCounts, TargetType,
} from '~/interfaces/IPost';
import useCommonController from '~/screens/store';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import useModalStore from '~/store/modal';

export interface Props {
  postId: string;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
  targetType?: TargetType;
}

const useContentActions = (props: Props) => {
  const {
    postId, ownerReactions, reactionsCount, targetType,
  } = props;

  const commonController = useCommonController((state) => state.actions);
  const { putMarkSeenPost } = usePostsStore((state: IPostsState) => state.actions);
  const modalActions = useModalStore((state) => state.actions);

  const onPressMarkSeenPost = useCallback(() => {
    putMarkSeenPost({ postId });
  }, [postId]);

  const onAddReaction = (reactionId: ReactionType) => {
    const data: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost({ type: 'put', data, targetType });
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const data: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionsCount,
    };
    commonController.reactToPost({ type: 'delete', data });
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'POST', targetId: postId },
    };
    modalActions.showReactionDetailBottomSheet(payload);
  };

  return {
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
    onPressMarkSeenPost,
  };
};

export default useContentActions;
