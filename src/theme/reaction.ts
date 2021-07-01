export interface contentReactionType {
  like: string;
  share: string;
  comment: string;
}

export const contentReactionIcons: contentReactionType = {
  like: 'iconLike',
  share: 'iconShare',
  comment: 'iconComment',
};

export const contentReactionLabels: contentReactionType = {
  like: 'label_like',
  share: 'label_share',
  comment: 'label_comment',
};
