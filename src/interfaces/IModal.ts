import { ReactionType } from '~/constants/reactions';
import { IReactionCounts } from '~/interfaces/IPost';

export interface IPayloadReactionDetailBottomSheet {
  isOpen: boolean;
  reactionsCount: IReactionCounts;
  initReaction: ReactionType;
  getDataParam?: any;
}
