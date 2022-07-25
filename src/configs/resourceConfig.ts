import getEnv from '~/utils/env';

export const uploadTypes = {
  userAvatar: 'user_avatar',
  userCover: 'user_cover',

  groupAvatar: 'group_avatar',
  groupCover: 'group_cover',

  postImage: 'post_image',
  postVideo: 'post_video',
  postFile: 'post_file',

  commentImage: 'comment_image',
  commentVideo: 'comment_video',
  commentFile: 'comment_file',
};

export type IUploadType = typeof uploadTypes[keyof typeof uploadTypes];

export const uploadEndpoints: any = {
  user_avatar: 'user/avatar/images/',
  user_cover: 'user/cover/images/',

  group_avatar: 'group/avatar/images/',
  group_cover: 'group/cover/images/',

  post_image: 'post/images/',
  post_video: 'post/videos/',
  post_file: 'post/files/',

  comment_image: 'comment/images/',
  comment_video: 'comment/videos/',
  comment_file: 'comment/files/',
};

export const resourceVariants = {
  original: 'original',
};

export type IResourceVariant = keyof typeof resourceVariants;

export const getResourceUrl = (
  uploadType: IUploadType | string,
  fileName: string,
  variant?: IResourceVariant | string,
) => `${getEnv('BEIN_RESOURCE')}${uploadEndpoints[uploadType]}${
  variant || 'original'
}/${fileName}`;
