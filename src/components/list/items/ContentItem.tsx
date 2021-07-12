import React from 'react';
import {contentReactionIcons, contentReactionLabels} from '~/theme/reaction';
import Post from '~/components/fragments/post/Post';
import icons, {IconType} from '~/resources/icons';

export interface reactionType {
  like: number;
  comment: number;
  share: number;
}

export interface reactionActionsType {
  type: string;
  icon: IconType;
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
    <Post
      reaction={reaction}
      isLike={isLike}
      reactionActions={reactionActions}
      {...props}
    />
  );
};

export default React.memo(ContentItem);
