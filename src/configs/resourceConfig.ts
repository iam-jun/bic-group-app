import {getEnv} from '~/utils/env';

export const uploadTypes = {
  userAvatar: 'userAvatar',
  userCover: 'userCover',

  groupAvatar: 'groupAvatar',
  groupCover: 'groupCover',

  postImage: 'postImage',
  postVideo: 'postVideo',
  postFile: 'postFile',

  commentImage: 'commentImage',
  commentVideo: 'commentVideo',
  commentFile: 'commentFile',

  chatImage: 'chatImage',
  chatVideo: 'chatVideo',
  chatFile: 'chatFile',
};

export type IUploadType = typeof uploadTypes[keyof typeof uploadTypes];

export const uploadEndpoints: any = {
  userAvatar: 'user/avatar/images/',
  userCover: 'user/cover/images/',

  groupAvatar: 'group/avatar/images/',
  groupCover: 'group/cover/images/',

  postImage: 'post/images/',
  postVideo: 'post/videos/',
  postFile: 'post/files/',

  commentImage: 'comment/images/',
  commentVideo: 'comment/videos/',
  commentFile: 'comment/files/',

  chatImage: 'chat/images/',
  chatVideo: 'chat/videos/',
  chatFile: 'chat/files/',
};

export const resourceVariants = {
  original: 'original',
};

export type IResourceVariant = keyof typeof resourceVariants;

export const getResourceUrl = (
  uploadType: IUploadType | string,
  fileName: string,
  variant?: IResourceVariant | string,
) => {
  return `${getEnv('BEIN_RESOURCE')}${uploadEndpoints[uploadType]}${
    variant || 'original'
  }/${fileName}`;
};
