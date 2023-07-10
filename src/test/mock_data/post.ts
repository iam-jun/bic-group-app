import { GroupPrivacyType } from '~/constants/privacyTypes';
import { PostStatus } from '~/interfaces/IPost';

export const POST_DETAIL = {
  ownerReactions: [
    {
      id: '23',
      postId: '28',
      reactionName: 'wink',
      createdBy: '33',
      createdAt: '2022-04-20T08:54:31.210Z',
    },
  ],
  id: '28',
  content: 'Hello world @thanvanvan ',
  media: {
    files: [],
    videos: [],
    images: [
      {
        id: '9',
        name: '79357605-a0f0-4b12-b0d5-91409ff5b085.jpeg',
        url: 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/79357605-a0f0-4b12-b0d5-91409ff5b085.jpeg',
        width: 640,
        height: 432,
      },
    ],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: false,
    importantExpiredAt: null,
  },
  status: PostStatus.PUBLISHED,
  actor: {
    id: '33',
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: {
    thanvanvan: {
      id: '83',
      username: 'thanvanvan',
      fullname: 'Than Van Van',
      avatar:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
    },
  },
  commentsCount: 5,
  reactionsCount: [
    {
      wink: 1,
    },
    {
      thinking_face: 1,
    },
  ],
  createdAt: '2022-04-20T09:55:55.599Z',
  createdBy: '33',
  audience: {
    groups: [
      {
        id: '1',
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: ['139', '2', '10', '152', '66', '67', '103', '2', '2'],
      },
    ],
  },
  comments: {
    list: [
      {
        totalReply: 2,
        ownerReactions: [],
        id: '10',
        actor: {
          id: '33',
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: '0',
        postId: '28',
        content: 'Cmt1',
        createdAt: '2022-04-20T10:06:08.579Z',
        updatedAt: '2022-04-20T10:06:30.617Z',
        media: [],
        reactionsCount: null,
        mentions: [],
        child: [
          {
            totalReply: 0,
            ownerReactions: [],
            id: '13',
            actor: {
              id: '33',
              username: 'ngoclinh',
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            parentId: '10',
            postId: '28',
            content: 'Reply1',
            createdAt: '2022-04-20T10:06:24.367Z',
            updatedAt: '2022-04-20T10:06:24.367Z',
            media: [],
            reactionsCount: null,
            mentions: {},
          },
          {
            totalReply: 0,
            ownerReactions: [],
            id: '14',
            actor: {
              id: '33',
              username: 'ngoclinh',
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            parentId: '10',
            postId: '28',
            content: 'Reply2',
            createdAt: '2022-04-20T10:06:30.608Z',
            updatedAt: '2022-04-20T10:06:30.608Z',
            media: [],
            reactionsCount: null,
            mentions: {},
          },
        ],
      },
      {
        totalReply: 0,
        ownerReactions: [],
        id: '11',
        actor: {
          id: '33',
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: '0',
        postId: '28',
        content: 'Cmt2',
        createdAt: '2022-04-20T10:06:12.459Z',
        updatedAt: '2022-04-20T10:06:12.459Z',
        media: [],
        reactionsCount: null,
        mentions: [],
        child: [],
      },
      {
        totalReply: 0,
        ownerReactions: [],
        id: '12',
        actor: {
          id: '33',
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: '0',
        postId: '28',
        content: 'Cmt3',
        createdAt: '2022-04-20T10:06:16.411Z',
        updatedAt: '2022-04-20T10:06:16.411Z',
        media: [],
        reactionsCount: null,
        mentions: [],
        child: [],
      },
    ],
    meta: {
      total: 3,
      limit: '10',
    },
  },
};

export const POST_DETAIL_2 = {
  ownerReactions: [],
  id: '29',
  content: 'Important post',
  media: {
    videos: [],
    images: [],
    files: [],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: true,
    importantExpiredAt: '2022-04-20T11:07:08.129Z',
  },
  status: PostStatus.PUBLISHED,
  actor: {
    id: '33',
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: [],
  commentsCount: 0,
  reactionsCount: [],
  createdAt: '2022-04-20T10:06:45.649Z',
  createdBy: 33,
  audience: {
    groups: [
      {
        id: '1',
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: ['139', '2', '10', '152', '66', '67', '103', '2', '2'],
      },
    ],
  },
};

export const POST_DETAIL_4 = {
  ownerReactions: [],
  id: '2877e096-14dc-4836-a10f-fd5f2769b3b3',
  content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking **at its layout the point of** using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. **Many** desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  tags: [],
  lang: 'en',
  media: {
    videos: [],
    images: [],
    files: [],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: false,
    importantExpiredAt: null,
  },
  status: 'PUBLISHED',
  actor: {
    id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    username: 'trannamanh',
    fullname: 'Nam Anh',
    email: 'namanh@tgm.vn',
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
    isDeactivated: false,
  },
  mentions: [],
  commentsCount: 1,
  totalUsersSeen: 3,
  reactionsCount: [],
  markedReadPost: false,
  isSaved: false,
  createdAt: '2023-03-24T02:54:49.450Z',
  updatedAt: '2023-03-26T15:03:22.819Z',
  createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  audience: {
    groups: [
      {
        id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        name: 'EVOL Community',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
        communityId: '15337361-1577-4b7b-a31d-990df06aa446',
        isCommunity: true,
        privacy: 'OPEN',
        rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
    ],
  },
  comments: {
    list: [
      {
        edited: false,
        totalReply: 0,
        ownerReactions: [],
        id: 'e082c4af-adc0-48d9-a17b-5e36e2ce0303',
        actor: {
          id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
          username: 'lesison',
          fullname: 'Trai tim anh tan nat vi em',
          email: 'sison@evol.vn',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
          isDeactivated: false,
        },
        parentId: '00000000-0000-0000-0000-000000000000',
        postId: '2877e096-14dc-4836-a10f-fd5f2769b3b3',
        content: 'hi',
        giphyId: null,
        giphyUrl: null,
        createdAt: '2023-03-26T15:03:22.784Z',
        updatedAt: '2023-03-26T15:03:22.784Z',
        createdBy: '32866f20-65f9-4580-86db-6d4f6388b8ac',
        media: {
          videos: [],
          images: [],
          files: [],
        },
        reactionsCount: [],
        mentions: [],
        child: {
          list: [],
          meta: {
            limit: 10,
            offset: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    ],
    meta: {
      limit: 10,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  type: 'POST',
  privacy: 'OPEN',
  items: [],
  communities: [
    {
      id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
      name: 'EVOL Community',
      privacy: 'OPEN',
      communityId: '15337361-1577-4b7b-a31d-990df06aa446',
    },
  ],
  isReported: false,
  isHidden: false,
  series: [
    {
      id: 'f270eb32-eb6f-4a0f-bff2-a8afef9d44bf',
      title: 'test title cai nha',
      zindex: 1,
    },
  ],

};

export const POST_DETAIL_5 = {
  ownerReactions: [],
  id: 'e7fc49e6-1fa5-4c18-82e6-872a5780f5cc',
  content: 'hom nay la thu 6 mojt doan van rat dai va day la cau dau tien\n\ngia su day la doan thu 2 nha asdasd asdas asd asdasdas das dasd sgdfgm dfg d fgdf gdf gdfg f.',
  tags: [],
  lang: null,
  media: {
    videos: [],
    images: [],
    files: [],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: false,
    importantExpiredAt: null,
  },
  status: 'PUBLISHED',
  actor: {
    id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
    username: 'trannamanh',
    fullname: 'Nam Anh',
    email: 'namanh@tgm.vn',
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/59f52ee1-5dd5-4284-b1b5-21b038fbbf78.jpg',
    isDeactivated: false,
  },
  mentions: [],
  commentsCount: 2,
  totalUsersSeen: 3,
  reactionsCount: [],
  markedReadPost: false,
  isSaved: false,
  createdAt: '2023-03-24T04:27:09.893Z',
  updatedAt: '2023-03-26T15:16:17.469Z',
  createdBy: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
  audience: {
    groups: [
      {
        id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        name: 'EVOL Community',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
        communityId: '15337361-1577-4b7b-a31d-990df06aa446',
        isCommunity: true,
        privacy: 'OPEN',
        rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
    ],
  },
  comments: {
    list: [
      {
        edited: false,
        totalReply: 0,
        ownerReactions: [],
        id: '14e22254-e121-401e-9897-473eaddb6165',
        actor: {
          id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
          username: 'lesison',
          fullname: 'Trai tim anh tan nat vi em',
          email: 'sison@evol.vn',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
          isDeactivated: false,
        },
        parentId: '00000000-0000-0000-0000-000000000000',
        postId: 'e7fc49e6-1fa5-4c18-82e6-872a5780f5cc',
        content: 'alo',
        giphyId: null,
        giphyUrl: null,
        createdAt: '2023-03-26T15:16:17.450Z',
        updatedAt: '2023-03-26T15:16:17.450Z',
        createdBy: '32866f20-65f9-4580-86db-6d4f6388b8ac',
        media: {
          videos: [],
          images: [],
          files: [],
        },
        reactionsCount: [],
        mentions: [],
        child: {
          list: [],
          meta: {
            limit: 10,
            offset: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
      {
        edited: false,
        totalReply: 0,
        ownerReactions: [],
        id: 'fff9834d-e99a-4af6-975a-bd062aef10a4',
        actor: {
          id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
          username: 'lesison',
          fullname: 'Trai tim anh tan nat vi em',
          email: 'sison@evol.vn',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
          isDeactivated: false,
        },
        parentId: '00000000-0000-0000-0000-000000000000',
        postId: 'e7fc49e6-1fa5-4c18-82e6-872a5780f5cc',
        content: 'kkk',
        giphyId: null,
        giphyUrl: null,
        createdAt: '2023-03-26T15:16:10.904Z',
        updatedAt: '2023-03-26T15:16:10.904Z',
        createdBy: '32866f20-65f9-4580-86db-6d4f6388b8ac',
        media: {
          videos: [],
          images: [],
          files: [],
        },
        reactionsCount: [],
        mentions: [],
        child: {
          list: [],
          meta: {
            limit: 10,
            offset: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    ],
    meta: {
      limit: 10,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  type: 'POST',
  privacy: 'OPEN',
  items: [],
  communities: [
    {
      id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
      name: 'EVOL Community',
      privacy: 'OPEN',
      communityId: '15337361-1577-4b7b-a31d-990df06aa446',
    },
  ],
  isReported: false,
  isHidden: false,
  series: [
    {
      id: 'f270eb32-eb6f-4a0f-bff2-a8afef9d44bf',
      title: 'test title cai nha',
      zindex: 3,
    },
  ],
};

export const GROUP_AUDIENCE = {
  id: '1',
  parentId: null,
  name: 'EVOL Community',
  slug: 'evol-community-1641809088',
  description: 'The greatest community ever',
  level: 0,
  parents: null,
  icon: '',
  backgroundImgUrl: null,
  privacy: 'PUBLIC',
  chatId: 'rpq3unai7i8ztprmoz97rdjr7w',
  createdAt: '2022-01-10T10:04:48.685Z',
  updatedAt: '2022-01-10T10:04:48.928Z',
  deletedAt: null,
  children: [],
  userCount: '25',
  unique: '7bcef9a5-3474-45b9-a167-a68e7ebcfe9a',
  testID: 'post_select_audience.groups.item',
  isChecked: false,
};

export const CHILD_COMMENT = {
  totalReply: 0,
  ownerReactions: [],
  id: '494',
  actor: {
    id: '58',
    username: 'thuquyen',
    fullname: 'Nguyen Thi Thu Quyền',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
  },
  parentId: '490',
  postId: '302',
  content: '@trannamanh alo',
  createdAt: '2022-04-27T03:38:21.809Z',
  updatedAt: '2022-04-27T03:38:21.809Z',
  media: [],
  reactionsCount: null,
  mentions: [],
  child: [],
};

export const LIST_CHILD_COMMENT = [
  CHILD_COMMENT,
  {
    ...CHILD_COMMENT,
    id: '495',
    content: 'Ola',
    createdAt: '2022-04-27T03:38:25.693Z',
    updatedAt: '2022-04-27T03:38:25.693Z',
  },
];

export const allCommentsByParentIds = {
  302: [
    {
      ...CHILD_COMMENT,
      totalReply: 3,
      id: '490',
      parentId: '0',
      content: '.',
      createdAt: '2022-04-26T09:25:02.870Z',
      updatedAt: '2022-04-27T03:38:29.471Z',
      child: {
        list: [
          {
            ...CHILD_COMMENT,
            id: '505',
            content: '9',
            createdAt: '2022-04-27T03:54:38.962Z',
            updatedAt: '2022-04-27T03:54:38.962Z',
          },
          {
            ...CHILD_COMMENT,
            id: '496',
            content: 'Hihi',
          },
          {
            ...CHILD_COMMENT,
            id: '495',
            content: 'Ola',
            createdAt: '2022-04-27T03:38:25.693Z',
            updatedAt: '2022-04-27T03:38:25.693Z',
          },
          CHILD_COMMENT,
        ],
        meta: { hasPreviousPage: true, hasNextPage: false },
      },
    },
    {
      ...CHILD_COMMENT,
      id: '485',
      parentId: '0',
      content: '2',
      createdAt: '2022-04-26T07:02:25.251Z',
      updatedAt: '2022-04-26T07:02:25.251Z',
    },
    {
      ...CHILD_COMMENT,
      parentId: '0',
      id: '484',
      content: '1',
      createdAt: '2022-04-26T07:02:20.368Z',
      updatedAt: '2022-04-26T07:02:20.368Z',
    },
  ],
};

export const allCommentsByParentIdsWith1ChildComment = {
  302: [
    {
      ...CHILD_COMMENT,
      totalReply: 3,
      id: '490',
      parentId: 0,
      content: '.',
      createdAt: '2022-04-26T09:25:02.870Z',
      updatedAt: '2022-04-27T03:38:29.471Z',
      child: [
        {
          ...CHILD_COMMENT,
          id: '505',
          content: '9',
          createdAt: '2022-04-27T03:54:38.962Z',
          updatedAt: '2022-04-27T03:54:38.962Z',
        },
      ],
    },
    {
      ...CHILD_COMMENT,
      id: '485',
      parentId: '0',
      content: '2',
      createdAt: '2022-04-26T07:02:25.251Z',
      updatedAt: '2022-04-26T07:02:25.251Z',
    },
    {
      ...CHILD_COMMENT,
      id: '484',
      parentId: '0',
      content: '1',
      createdAt: '2022-04-26T07:02:20.368Z',
      updatedAt: '2022-04-26T07:02:20.368Z',
    },
  ],
};

export const allCommentsArray = [
  { ...allCommentsByParentIdsWith1ChildComment[302][0] },
  { ...allCommentsByParentIdsWith1ChildComment[302][0].child[0] },
  { ...allCommentsByParentIdsWith1ChildComment[302][0].child[1] },
  { ...allCommentsByParentIdsWith1ChildComment[302][0].child[2] },
  { ...allCommentsByParentIdsWith1ChildComment[302][1] },
  { ...allCommentsByParentIdsWith1ChildComment[302][2] },
];

export const baseCommentData = {
  ...CHILD_COMMENT,
  child: {
    list: [
      {
        ...CHILD_COMMENT,
        id: '505',
        content: '9',
        createdAt: '2022-04-27T03:54:38.962Z',
        updatedAt: '2022-04-27T03:54:38.962Z',
      },
    ],
    meta: { hasPreviousPage: false, hasNextPage: false },
  },
  content: '.',
  createdAt: '2022-04-26T09:25:02.870Z',
  id: '490',
  parentId: '0',
  totalReply: 12,
  updatedAt: '2022-04-27T03:54:38.969Z',
};

export const POST_DETAIL_3 = {
  ownerReactions: [],
  id: '302',
  content: 'Important post',
  media: {
    videos: [],
    images: [],
    files: [],
  },
  setting: {
    canReact: true,
    canComment: true,
    canShare: true,
    isImportant: true,
    importantExpiredAt: '2022-04-20T11:07:08.129Z',
  },
  status: PostStatus.PUBLISHED,
  actor: {
    id: '33',
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: [],
  commentsCount: 0,
  reactionsCount: [],
  createdAt: '2022-04-20T10:06:45.649Z',
  createdBy: 33,
  comments: {
    list: [
      {
        totalReply: 3,
        ownerReactions: [],
        id: '490',
        actor: {
          id: '2',
          username: 'trannamanh',
          fullname: 'Trần Nam Anh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
        },
        parentId: '0',
        postId: '302',
        content: '.',
        createdAt: '2022-04-26T09:25:02.870Z',
        updatedAt: '2022-04-27T03:38:29.471Z',
        media: [],
        reactionsCount: null,
        mentions: [],
        child: [
          {
            ...CHILD_COMMENT,
            id: '505',
            content: '9',
            createdAt: '2022-04-27T03:54:38.962Z',
            updatedAt: '2022-04-27T03:54:38.962Z',
          },
          {
            ...CHILD_COMMENT,
            id: '496',
            content: 'Hihi',
          },
          {
            ...CHILD_COMMENT,
            id: '495',
            content: 'Ola',
            createdAt: '2022-04-27T03:38:25.693Z',
            updatedAt: '2022-04-27T03:38:25.693Z',
          },
          CHILD_COMMENT,
        ],
      },
    ],
    meta: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
  audience: {
    groups: [
      {
        id: '1',
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: ['139', '2', '10', '152', '66', '67', '103', '2', '2'],
      },
    ],
  },
};

export const allPosts = {
  302: POST_DETAIL_3,
};

export const COMMENT_HAS_REACTION = {
  ...CHILD_COMMENT,
  ownerReactions: [
    {
      id: '23',
      commentId: '28',
      reactionName: 'wink',
      createdBy: '33',
      createdAt: '2022-04-20T08:54:31.210Z',
    },
  ],
  reactionsCount: [
    {
      wink: 1,
    },
    {
      thinking_face: 1,
    },
  ],
};

export const SEEN_POST = {
  data: [
    {
      fullname:
        'Admin 1 Tên siêu dài saddd dddddddddddddddddddddddddddddddddddde',
      id: '43',
      username: 'admin1',
      email: 'admin1@tgm.vn',
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/78442999-8f69-403e-afc7-d1a9e4083f7d.jpg',
      groups: ['1', '2', '3'],
    },
  ],
};

export const mockEditPost = {
  actor: {
    avatar:
      'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/c6b8b056-7d77-4382-b95c-010c2fda4809.jpg',
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
    images: [],
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
  status: PostStatus.PUBLISHED,
  tags: [],
  totalUsersSeen: 0,
  type: 'POST',
  updatedAt: '2023-02-14T04:11:41.368Z',
};

export const mockMediaVideos = [
  {
    extension: null,
    size: 1423668,
    name: 'Cute Cat - 3092.mp4',
    width: 640,
    id: 'fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90',
    mime_type: 'video/mp4',
    type: 'video',
    thumbnails: [
      {
        width: 427,
        url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90_427x240.jpg',
        height: 240,
      },
      {
        width: 640,
        url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90_640x360.jpg',
        height: 360,
      },
      {
        width: 853,
        url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90_853x480.jpg',
        height: 480,
      },
      {
        width: 1280,
        url: 'https://bic-dev-user-upload-videos-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/thumbnails/fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90_1280x720.jpg',
        height: 720,
      },
    ],
    url: 'https://cdn.beincom.io/media/hls/fbd12f73-8d64-4d8b-ac7a-dbe0a3018a90.m3u8',
    status: 'completed',
    height: 360,
    origin_name: 'Cute Cat - 3092.mp4',
  },
];

export const mockMediaFiles = [
  {
    id: '5ea75100-be59-49b4-b314-e103355540e9',
    name: 'DOC.doc',
    size: 1146880,
    status: 'completed',
    url: 'https://bic-dev-user-upload-files-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/5ea75100-be59-49b4-b314-e103355540e9',
    origin_name: 'DOC.doc',
    extension: null,
    mime_type: 'application/msword',
    type: 'file',
  },
];

export const mockMediaImages = [
  {
    id: 'e26e13cf-76b9-4a0a-a5ef-de9689808366',
    name: '821164a7-f817-435a-b6fd-ad4f90adf5ce.jpg',
    status: 'completed',
    url: 'https://bic-dev-user-upload-images-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/original/821164a7-f817-435a-b6fd-ad4f90adf5ce.jpg',
    size: 324722,
    origin_name: '7B8F1D15-B8F2-48B1-99F2-80C3356EB6D0.jpg',
    width: 800,
    height: 533,
    extension: 'jpeg',
    mime_type: 'image/jpeg',
    type: 'image',
  },
];

export const mockViewContentJoinRequire = {
  code: 'content.group_join_required',
  meta: {
    message: 'Join at least one group to keep reading',
    errors: {
      requireGroups: [
        {
          id: '813a618c-33d6-4c01-8b40-1b98f5d77805',
          name: 'Noti Phase 3 - Request Join',
          icon: 'https://media.beincom.app/image/variants/group/avatar/843fda0e-135c-4ba8-8e18-833864857fae',
          communityId: '042506ae-f848-4d80-bf52-c22bdefd3d5f',
          isCommunity: true,
          privacy: 'PRIVATE' as GroupPrivacyType,
          rootGroupId: '813a618c-33d6-4c01-8b40-1b98f5d77805',
        },
        {
          id: '813a618c-33d6-4c01-8b40-1b98f5d77885',
          name: 'Noti Phase 4 - Request Join',
          icon: 'https://media.beincom.app/image/variants/group/avatar/843fda0e-135c-4ba8-8e18-833864857faef',
          communityId: '042506ae-f848-4d80-bf52-c22bdefd3d5f',
          isCommunity: false,
          privacy: 'PRIVATE' as GroupPrivacyType,
          rootGroupId: '813a618c-33d6-4c01-8b40-1b98f5d77805',
        },
      ],
    },
    stack: [
      'ForbiddenException: Join at least one group to keep reading',
      '    at ArticleController.get (/usr/src/app/src/modules/article/article.controller.ts:139:17)',
      '    at processTicksAndRejections (node:internal/process/task_queues:96:5)',
    ],
  },
};
