import { PostStatus } from '~/interfaces/IPost';

export const LIST_DRAFT_POST = [
  {
    actor: {
      createdAt: '2022-01-24T08:35:18.713097Z',
      updatedAt: '2022-04-06T09:24:48.434672Z',
      id: '58',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
        fullname: 'Nguyen Thi Thu Quyền',
        username: 'thuquyen',
      },
    },
    audience: {
      groups: [
        {
          id: '56',
          collection: 'groups',
          foreign_id: 'groups:56',
          data: {
            icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
            name: 'Khanh and Khanh only',
          },
          createdAt: '2022-01-18T08:39:38.873799Z',
          updatedAt: '2022-01-18T08:39:38.873799Z',
        },
      ],
      users: [],
    },
    foreign_id: 'b76809ad-ab41-471e-987d-6d39040adc9b',
    id: 'e3f89ee0-99fd-11ec-8080-800122e4fb02',
    important: { active: false, expiresTime: null },
    is_draft: true,
    mentions: { groupIds: [], userIds: [] },
    object: {
      id: 'e4252077-5ba6-4868-b42a-1c340b033a00',
      collection: 'post',
      foreign_id: 'post:e4252077-5ba6-4868-b42a-1c340b033a00',
      data: {
        images: [], videos: [], files: [], content: 'Hhhhhhyuuu',
      },
      createdAt: '2022-03-02T07:53:47.219579Z',
      updatedAt: '2022-03-02T07:54:02.524509Z',
    },
    origin: null,
    settings: { can_comment: true, can_react: true, can_share: true },
    tags: [],
    target: '',
    time: '2022-03-02T07:53:47.214000',
    type: 'post',
    verb: 'post',
    latest_reactions_extra: {},
  },
  {
    actor: {
      createdAt: '2022-01-24T08:35:18.713097Z',
      updatedAt: '2022-04-06T09:24:48.434672Z',
      id: '58',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
        fullname: 'Nguyen Thi Thu Quyền',
        username: 'thuquyen',
      },
    },
    audience: {
      groups: [
        {
          id: '2',
          collection: 'groups',
          foreign_id: 'groups:2',
          data: { icon: '', name: 'Crypto Inner Circle' },
          createdAt: '2022-01-10T10:04:48.773397Z',
          updatedAt: '2022-01-10T10:04:48.773397Z',
        },
      ],
      users: [],
    },
    foreign_id: 'b0401830-06fb-4b02-8117-fc5c1e69dde9',
    id: '7939d500-99e0-11ec-8080-8000222c71e4',
    important: { active: false, expiresTime: null },
    is_draft: true,
    mentions: { groupIds: [], userIds: [] },
    object: {
      id: '172add51-0068-4166-ad11-b65032b7f3bd',
      collection: 'post',
      foreign_id: 'post:172add51-0068-4166-ad11-b65032b7f3bd',
      data: {
        images: [], videos: [], files: [], content: '',
      },
      createdAt: '2022-03-02T04:23:12.773397Z',
      updatedAt: '2022-03-02T04:23:32.794078Z',
    },
    origin: null,
    settings: { can_comment: true, can_react: true, can_share: true },
    tags: [],
    target: '',
    time: '2022-03-02T04:23:12.720000',
    type: 'post',
    verb: 'post',
    latest_reactions_extra: {},
  },
];

export const LOAD_MORE_LIST_DRAFT_POST = [
  {
    actor: {
      createdAt: '2022-01-24T08:35:18.713097Z',
      updatedAt: '2022-04-06T09:24:48.434672Z',
      id: '58',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
        fullname: 'Nguyen Thi Thu Quyền',
        username: 'thuquyen',
      },
    },
    audience: {
      groups: [
        {
          id: '56',
          collection: 'groups',
          foreign_id: 'groups:56',
          data: {
            icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
            name: 'Khanh and Khanh only',
          },
          createdAt: '2022-01-18T08:39:38.873799Z',
          updatedAt: '2022-01-18T08:39:38.873799Z',
        },
      ],
      users: [],
    },
    foreignId: 'b76809ad-ab41-471e-987d-6d39040adc9b',
    id: 'e3f89ee0-99fd-11ec-8080-99900000997788',
    important: { active: false, expiresTime: null },
    isDraft: true,
    mentions: { groupIds: [], userIds: [] },
    object: {
      id: 'e4252077-5ba6-4868-b42a-1c340b033a00',
      collection: 'post',
      foreign_id: 'post:e4252077-5ba6-4868-b42a-1c340b033a00',
      data: {
        images: [], videos: [], files: [], content: 'Hhhhhhyuuu',
      },
      createdAt: '2022-03-02T07:53:47.219579Z',
      updatedAt: '2022-03-02T07:54:02.524509Z',
    },
    origin: null,
    settings: { can_comment: true, can_react: true, can_share: true },
    tags: [],
    target: '',
    time: '2022-03-02T07:53:47.214000',
    type: 'post',
    verb: 'post',
    latest_reactions_extra: {},
  },
];
export const POST_CONTAINING_VIDEO_PROCESS = {
  id: '34a808ea-8c15-4516-a8d4-23a9dcd7053a',
  content: 'Eeee',
  media: {
    files: [],
    videos: [
      {
        thumbnails: [
          {
            width: 457,
            height: 240,
            url: 'https://bein-user-upload-videos-sandbox.s3.ap-southeast-1.amazonaws.com/post/thumbnails/bad3d8e3-8363-4781-af10-3e8ec2ac198a_457x240.jpg',
          },
          {
            width: 686,
            height: 360,
            url: 'https://bein-user-upload-videos-sandbox.s3.ap-southeast-1.amazonaws.com/post/thumbnails/bad3d8e3-8363-4781-af10-3e8ec2ac198a_686x360.jpg',
          },
          {
            width: 914,
            height: 480,
            url: 'https://bein-user-upload-videos-sandbox.s3.ap-southeast-1.amazonaws.com/post/thumbnails/bad3d8e3-8363-4781-af10-3e8ec2ac198a_914x480.jpg',
          },
          {
            width: 1371,
            height: 720,
            url: 'https://bein-user-upload-videos-sandbox.s3.ap-southeast-1.amazonaws.com/post/thumbnails/bad3d8e3-8363-4781-af10-3e8ec2ac198a_1371x720.jpg',
          },
        ],
        id: 'bad3d8e3-8363-4781-af10-3e8ec2ac198a',
        status: 'processing',
        name: '035318DB-73A8-42CD-9859-041E059E6610.mp4',
        url: null,
        size: 0,
        mimeType: null,
      },
    ],
    images: [],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: false,
    importantExpiredAt: null,
  },
  status: PostStatus.DRAFT,
  isProcessing: true,
  actor: {
    id: 58,
    username: 'thuquyen',
    fullname: 'Nguyen Thi Thu Quyền',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/6565aa5e-112d-4d6e-825d-bdea2166ad3d.jpg',
    email: 'thuquyen@tgm.vn',
  },
  mentions: [],
  totalUsersSeen: 0,
  reactionsCount: null,
  createdAt: '2022-06-29T07:54:18.729Z',
  updatedAt: '2022-06-29T07:54:18.729Z',
  createdBy: 58,
  audience: {
    groups: [
      {
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/e55a5e2f-5f61-4a1b-ad3f-623f08eec1a1',
        privacy: 'PUBLIC',
      },
    ],
  },
  type: 'POST',
  privacy: 'PUBLIC',
};

export const LIST_POST_CONTAINING_VIDEO_PROCESS_1 = [
  POST_CONTAINING_VIDEO_PROCESS,
];

export const LIST_POST_CONTAINING_VIDEO_PROCESS_2 = [
  POST_CONTAINING_VIDEO_PROCESS,
  { ...POST_CONTAINING_VIDEO_PROCESS, id: '2' },
];

export const mockDraftPost = {
  actor: {
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/c6b8b056-7d77-4382-b95c-010c2fda4809.jpg',
    email: 'thuquyen@tgm.vn',
    fullname: 'Nguyen Thi Thu Quyền',
    id: 'a0143446-0e51-4903-b280-8c794d470903',
    username: 'thuquyen',
  },
  articles: [],
  audience: {
    groups: [
      {
        communityId: '15337361-1577-4b7b-a31d-990df06aa446',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
        id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        isCommunity: true,
        name: 'EVOL Community',
        privacy: 'OPEN',
        rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
    ],
  },
  commentsCount: 0,
  communities: [
    {
      communityId: '15337361-1577-4b7b-a31d-990df06aa446',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
      id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      name: 'EVOL Community',
      privacy: 'OPEN',
    },
  ],
  content: 'Test video',
  createdAt: '2023-02-03T07:48:11.646Z',
  createdBy: 'a0143446-0e51-4903-b280-8c794d470903',
  id: '026e1977-96d1-4f02-a06d-695c3f900b42',
  isHidden: false,
  isReported: false,
  lang: null,
  media: {
    files: [],
    images: [
    ],
    videos: [],
  },
  mentions: {},
  privacy: 'OPEN',
  reactionsCount: null,
  setting: {
    canComment: true,
    canReact: true,
    canShare: true,
    importantExpiredAt: null,
    isImportant: false,
  },
  status: 'DRAFT',
  tags: [],
  totalUsersSeen: 0,
  type: 'POST',
  updatedAt: '2023-02-14T04:11:41.368Z',
};
