import React from 'react';
import Post from '~/screens/Home/fragments/Post';
import {IconType} from '~/resources/icons';
import {ReactionType} from '~/constants/reactions';

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
  reaction?: ReactionType;
  isLike?: boolean;
  [x: string]: any;
}

const ContentItem: React.FC<Props> = ({
  type = 'post',
  reaction,
  isLike,
  ...props
}) => {
  return <Post reaction={reaction} isLike={isLike} {...props} />;
};

export default React.memo(ContentItem);
