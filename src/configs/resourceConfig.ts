export const uploadEndpoints: any = {
  user_avatar: 'user/avatar/images/',
  user_cover: 'user/cover/images/',

  group_avatar: 'group/avatar/images/',
  group_cover: 'group/cover/images/',

  post_image: 'post/',
  post_video: 'post/videos/',
  post_file: 'post/files/',

  comment_image: 'comment/',
  comment_video: 'comment/videos/',
  comment_file: 'comment/files/',
};

export const resourceVariants = {
  original: 'original',
};

export type IResourceVariant = keyof typeof resourceVariants;
