import { IconType } from '~/resources/icons';
import { ReactionType } from '~/constants/reactions';

export interface IReactionProps {
  id: ReactionType;
  icon: IconType;
}
