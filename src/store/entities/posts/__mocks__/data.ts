export const postCreatePost = {
  audience: { groupIds: ['aea46e6d-f145-459a-8fc1-830ba2d7e0f9'], userIds: [] },
  content: 'Test edit post1',
  linkPreview: null,
  media: { files: [], images: [], videos: [] },
  mentions: {},
  setting: {
    canComment: true,
    canReact: true,
    importantExpiredAt: null,
    isImportant: false,
  },
  status: 'PUBLISHED',
};

export const responsePutEditPost = {
  code: 'api.ok',
  data: {
    actor: {
      avatar:
        'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
      email: 'namanh@tgm.vn',
      fullname: 'Nam Anh',
      id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
      username: 'trannamanh',
    },
    articles: [],
    audience: { groups: ['Array'] },
    comments: null,
    commentsCount: 0,
    communities: [['Object']],
    content: 'Test edit post1',
    createdAt: '2023-01-20T10:07:55.047Z',
    createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    id: 'dbbee59a-f55d-4441-8b80-1d0d878897de',
    isHidden: false,
    isReported: false,
    isSaved: false,
    lang: 'ko',
    linkPreview: null,
    markedReadPost: false,
    media: { files: ['Array'], images: ['Array'], videos: ['Array'] },
    mentions: {},
    ownerReactions: [],
    privacy: 'OPEN',
    reactionsCount: {},
    setting: {
      canComment: true,
      canReact: true,
      canShare: true,
      importantExpiredAt: null,
      isImportant: false,
    },
    status: 'PUBLISHED',
    tags: [],
    totalUsersSeen: 1,
    type: 'POST',
    updatedAt: '2023-01-20T10:08:05.078Z',
  },
  meta: { message: 'Post has been published successfully' },
};

export const responsePutMarkSeenPost = { code: 'api.ok', data: true, meta: { message: 'OK' } };
