import {IObject} from '~/interfaces/common';
import {IReactionProps} from '~/interfaces/IReaction';

export const reactions: IObject<IReactionProps> = {
  love: {
    icon: 'iconReactionLove',
  },
  haha: {
    icon: 'iconReactionHaha',
  },
  shocked: {
    icon: 'iconReactionShocked',
  },
  sad: {
    icon: 'iconReactionSad',
  },
  angry: {
    icon: 'iconReactionAngry',
  },
  dislike: {
    icon: 'iconReactionDislike',
  },
  like: {
    icon: 'iconReactionLike',
  },
};

export type ReactionType = keyof typeof reactions;
export default reactions;
