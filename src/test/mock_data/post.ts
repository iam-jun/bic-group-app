export const POST_DETAIL = {
  ownerReactions: [
    {
      id: 23,
      postId: 28,
      reactionName: 'wink',
      createdBy: 33,
      createdAt: '2022-04-20T08:54:31.210Z',
    },
  ],
  id: 28,
  content: 'Hello world @thanvanvan ',
  media: {
    files: [],
    videos: [],
    images: [
      {
        id: 9,
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
  isDraft: false,
  actor: {
    id: 33,
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: {
    thanvanvan: {
      id: 83,
      username: 'thanvanvan',
      fullname: 'Than Van Van',
      avatar:
        'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
    },
  },
  commentsCount: 5,
  reactionsCount: {
    0: {
      wink: 1,
    },
    1: {
      thinking_face: 1,
    },
  },
  createdAt: '2022-04-20T09:55:55.599Z',
  createdBy: 33,
  audience: {
    groups: [
      {
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: [139, 2, 10, 152, 66, 67, 103, 2, 2],
      },
    ],
  },
  comments: {
    list: [
      {
        totalReply: 2,
        ownerReactions: [],
        id: 10,
        actor: {
          id: 33,
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: 0,
        postId: 28,
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
            id: 13,
            actor: {
              id: 33,
              username: 'ngoclinh',
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            parentId: 10,
            postId: 28,
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
            id: 14,
            actor: {
              id: 33,
              username: 'ngoclinh',
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            parentId: 10,
            postId: 28,
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
        id: 11,
        actor: {
          id: 33,
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: 0,
        postId: 28,
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
        id: 12,
        actor: {
          id: 33,
          username: 'ngoclinh',
          fullname: 'Nguyễn Thị Ngọc Linh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        },
        parentId: 0,
        postId: 28,
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
  id: 29,
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
  isDraft: false,
  actor: {
    id: 33,
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: [],
  commentsCount: 0,
  reactionsCount: {},
  createdAt: '2022-04-20T10:06:45.649Z',
  createdBy: 33,
  audience: {
    groups: [
      {
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: [139, 2, 10, 152, 66, 67, 103, 2, 2],
      },
    ],
  },
};

export const GROUP_AUDIENCE = {
  id: 1,
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
  id: 494,
  actor: {
    id: 58,
    username: 'thuquyen',
    fullname: 'Nguyen Thi Thu Quyền',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
  },
  parentId: 490,
  postId: 302,
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
    id: 495,
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
      id: 490,
      parentId: 0,
      content: '.',
      createdAt: '2022-04-26T09:25:02.870Z',
      updatedAt: '2022-04-27T03:38:29.471Z',
      child: {
        list: [
          {
            ...CHILD_COMMENT,
            id: 505,
            content: '9',
            createdAt: '2022-04-27T03:54:38.962Z',
            updatedAt: '2022-04-27T03:54:38.962Z',
          },
          {
            ...CHILD_COMMENT,
            id: 496,
            content: 'Hihi',
          },
          {
            ...CHILD_COMMENT,
            id: 495,
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
      id: 485,
      parentId: 0,
      content: '2',
      createdAt: '2022-04-26T07:02:25.251Z',
      updatedAt: '2022-04-26T07:02:25.251Z',
    },
    {
      ...CHILD_COMMENT,
      parentId: 0,
      id: 484,
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
      id: 490,
      parentId: 0,
      content: '.',
      createdAt: '2022-04-26T09:25:02.870Z',
      updatedAt: '2022-04-27T03:38:29.471Z',
      child: [
        {
          ...CHILD_COMMENT,
          id: 505,
          content: '9',
          createdAt: '2022-04-27T03:54:38.962Z',
          updatedAt: '2022-04-27T03:54:38.962Z',
        },
      ],
    },
    {
      ...CHILD_COMMENT,
      id: 485,
      parentId: 0,
      content: '2',
      createdAt: '2022-04-26T07:02:25.251Z',
      updatedAt: '2022-04-26T07:02:25.251Z',
    },
    {
      ...CHILD_COMMENT,
      id: 484,
      parentId: 0,
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
        id: 505,
        content: '9',
        createdAt: '2022-04-27T03:54:38.962Z',
        updatedAt: '2022-04-27T03:54:38.962Z',
      },
    ],
    meta: { hasPreviousPage: false, hasNextPage: false },
  },
  content: '.',
  createdAt: '2022-04-26T09:25:02.870Z',
  id: 490,
  parentId: 0,
  totalReply: 12,
  updatedAt: '2022-04-27T03:54:38.969Z',
};

export const POST_DETAIL_3 = {
  ownerReactions: [],
  id: 302,
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
  isDraft: false,
  actor: {
    id: 33,
    username: 'ngoclinh',
    fullname: 'Nguyễn Thị Ngọc Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
  },
  mentions: [],
  commentsCount: 0,
  reactionsCount: {},
  createdAt: '2022-04-20T10:06:45.649Z',
  createdBy: 33,
  comments: {
    list: [
      {
        totalReply: 3,
        ownerReactions: [],
        id: 490,
        actor: {
          id: 2,
          username: 'trannamanh',
          fullname: 'Trần Nam Anh',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
        },
        parentId: 0,
        postId: 302,
        content: '.',
        createdAt: '2022-04-26T09:25:02.870Z',
        updatedAt: '2022-04-27T03:38:29.471Z',
        media: [],
        reactionsCount: null,
        mentions: [],
        child: [
          {
            ...CHILD_COMMENT,
            id: 505,
            content: '9',
            createdAt: '2022-04-27T03:54:38.962Z',
            updatedAt: '2022-04-27T03:54:38.962Z',
          },
          {
            ...CHILD_COMMENT,
            id: 496,
            content: 'Hihi',
          },
          {
            ...CHILD_COMMENT,
            id: 495,
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
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: [139, 2, 10, 152, 66, 67, 103, 2, 2],
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
      id: 23,
      commentId: 28,
      reactionName: 'wink',
      createdBy: 33,
      createdAt: '2022-04-20T08:54:31.210Z',
    },
  ],
  reactionsCount: {
    0: {
      wink: 1,
    },
    1: {
      thinking_face: 1,
    },
  },
};

export const SEEN_POST = {
  data: [
    {
      fullname:
        'Admin 1 Tên siêu dài saddd dddddddddddddddddddddddddddddddddddde',
      id: 43,
      username: 'admin1',
      email: 'admin1@tgm.vn',
      avatar:
        'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/78442999-8f69-403e-afc7-d1a9e4083f7d.jpg',
      groups: [1, 2, 3],
    },
  ],
};
