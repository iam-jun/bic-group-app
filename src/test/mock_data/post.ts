export const POST_DETAIL = {
  ownerReactions: [],
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
    '0': {
      grinning: 1,
    },
    '1': {
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
  parent_id: null,
  name: 'EVOL Community',
  slug: 'evol-community-1641809088',
  description: 'The greatest community ever',
  level: 0,
  parents: null,
  owner_id: 1,
  icon: '',
  background_img_url: null,
  group_type: 'COMPANY',
  privacy: 'PUBLIC',
  chat_id: 'rpq3unai7i8ztprmoz97rdjr7w',
  created_at: '2022-01-10T10:04:48.685Z',
  updated_at: '2022-01-10T10:04:48.928Z',
  deleted_at: null,
  children: [],
  user_count: '25',
  unique: '7bcef9a5-3474-45b9-a167-a68e7ebcfe9a',
  testID: 'post_select_audience.groups.item',
  isChecked: false,
};
