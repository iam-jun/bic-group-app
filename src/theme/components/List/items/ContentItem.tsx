import React from 'react';
import {
  contentReactionIcons,
  contentReactionLabels,
} from '~/theme/configs/reaction';
import PostItem from '~/theme/components/List/items/PostItem';

export interface reactionType {
  like: number;
  comment: number;
  share: number;
}

export interface reactionActionsType {
  type: string;
  icon: string;
  label: string;
  value: number;
  isLike: boolean;
}

export interface Props {
  type?: string;
  reaction?: reactionType;
  isLike?: boolean;
  [x: string]: any;
}

const ContentItem: React.FC<Props> = ({
  type = 'post',
  reaction,
  isLike,
  ...props
}) => {
  let reactionActions: reactionActionsType[];

  if (reaction)
    reactionActions = Object.keys(reaction).map(key => ({
      type: key,
      icon: contentReactionIcons[key],
      label: contentReactionLabels[key],
      value: reaction[key],
      isLike: key === 'like' && isLike,
    }));

  return (
    <PostItem
      reaction={reaction}
      isLike={isLike}
      reactionActions={reactionActions}
      {...props}
    />
  );
};

export default ContentItem;
