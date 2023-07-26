export const mockNotifications = [
  {
    id: 'aa2f1634-e690-4ee7-a9f0-42aaf3f97314',
    activities: [
      {
        id: '49640632-728d-415f-a1fc-5ab6e1401bdd',
        actor: {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        title: 'test Article',
        content: '',
        setting: {
          can_react: true,
          can_share: true,
          can_comment: true,
          is_important: false,
          important_expired_at: null,
        },
        created_at: '2023-02-21T04:17:36.983Z',
        updated_at: '2023-02-21T04:17:36.983Z',
        content_type: 'article',
      },
    ],
    group: 'p-49640632-728d-415f-a1fc-5ab6e1401bdd:POST:ARTICLE:post.article.to_user.in_multiple_groups',
    target: 'ARTICLE',
    verb: 'POST',
    activity_count: 1,
    actor_count: 2,
    extra: {
      type: 'post.article.to_user.in_multiple_groups',
      actors: [
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e37ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6eewww4135f.jpg',
          fullname: 'Linh Linh 2',
          username: 'ngoclinh',
        },
      ],
      description: '**Linh Linh** created an article in **3** groups',
      content: 'test Article',
    },
    is_read: false,
    is_seen: false,
    created_at: '2023-02-21T04:18:34.954Z',
    updated_at: '2023-02-21T04:18:34.954Z',
  },
  {
    id: 'edf27208-6def-48d7-9479-7d054da6a5cc',
    activities: [
      {
        id: 'e77adafb-ecef-40d3-b7d6-c22dbe903f3a',
        actor: {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        title: '',
        content: '## the future.',
        created_at: '2023-02-21T01:50:43.320Z',
        updated_at: '2023-02-21T01:50:43.320Z',
        content_type: 'post',
        reactions_count: {
        },
      },
    ],
    group: 'p-e77adafb-ecef-40d3-b7d6-c22dbe903f3a:POST:POST:post.to_user.in_multiple_groups',
    target: 'POST',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.video.to_user.unsuccessful',
      actors: [
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
      ],
      description: '**Linh Linh** posted in **4** groups',
      content: 'Creative Writing\nGenerating random paragraphs can be an excellent',
    },
    is_read: false,
    is_seen: false,
    created_at: '2023-02-21T01:51:11.467Z',
    updated_at: '2023-02-21T01:51:11.467Z',
  },
  {
    id: '537edcc8-027c-44b0-93da-e9e4fa88a75f',
    activities: [
      {
        id: '925f96c2-f413-4a9f-b3c6-bce4b99ecdd3',
        actor: {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        title: '',
        content: 'test tag Series on Post',
        setting: {
          can_react: true,
          can_share: true,
          can_comment: true,
          is_important: false,
          important_expired_at: null,
        },
        created_at: '2023-02-21T01:06:40.192Z',
        updated_at: '2023-02-21T01:06:40.192Z',
        content_type: 'post',
        reactions_count: {

        },
      },
    ],
    group: 'p-925f96c2-f413-4a9f-b3c6-bce4b99ecdd3:POST:POST:comment.to_post_creator',
    target: 'POST',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'comment.to_post_creator',
      actors: [
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
      ],
      description: '**Linh Linh** posted in **3** groups',
      content: 'test tag Series on Post',
    },
    is_read: false,
    is_seen: false,
    created_at: '2023-02-21T01:07:31.628Z',
    updated_at: '2023-02-21T01:07:31.628Z',
  },
  {
    id: '3baeda85-7eb7-442b-9ad7-2b8202c2c6be',
    activities: [
      {
        id: '255aca15-8991-463b-9b7e-31c08a049c5b',
        actor: {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
        title: 'qwe321',
        content: '',
        created_at: '2023-02-03T08:45:15.630Z',
        updated_at: '2023-02-03T08:45:15.630Z',
        content_type: 'article',
        reactions_count: {

        },
      },
    ],
    group: 'p-255aca15-8991-463b-9b7e-31c08a049c5b:POST:ARTICLE:post.article.to_user.in_one_group',
    target: 'ARTICLE',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.article.to_user.in_one_group',
      actors: [
        {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
      ],
      description: '**Nam Anh** created an article in **EVOL Community**',
      content: 'qwe321',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-18T02:59:54.395Z',
    updated_at: '2023-02-18T02:59:54.395Z',
  },
  {
    id: 'a61525b6-94a1-46ed-8140-864925691405',
    activities: [
      {
        id: '6c2ba7c2-5dcc-42a2-9c58-c438b5b8b49c',
        actor: {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
        title: '',
        content: 'https://www.beincom.io/',
        created_at: '2023-02-17T10:49:26.305Z',
        updated_at: '2023-02-17T10:49:26.305Z',
        content_type: 'post',
        reactions_count: {

        },
      },
    ],
    group: 'p-6c2ba7c2-5dcc-42a2-9c58-c438b5b8b49c:ARTICLE:ARTICLE:post.to_user.in_one_group',
    target: 'ARTICLE',
    verb: 'ARTICLE',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.to_user.in_one_group',
      actors: [
        {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
      ],
      description: '**Nam Anh** posted in **EVOL Community**',
      content: 'https://www.beincom.io/',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-17T11:25:21.506Z',
    updated_at: '2023-02-17T11:25:21.506Z',
  },
  {
    id: 'c92f5b31-9095-46e9-b17e-0f6691ef6f37',
    activities: [
      {
        id: 'd7bd6a33-d617-4669-b8c7-d40028a76ec6',
        actor: {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
        title: '',
        content: 'https://www.beincom.io/posts/67e1319c-ee1d-466a-b479-0e939a2765be',
        created_at: '2023-02-17T10:50:37.825Z',
        updated_at: '2023-02-17T10:50:37.825Z',
        content_type: 'post',
        reactions_count: {

        },
      },
    ],
    group: 'p-d7bd6a33-d617-4669-b8c7-d40028a76ec6:POST:POST:post.to_user.in_one_group',
    target: 'POST',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.to_user.in_one_group',
      actors: [
        {
          id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/acb214d0-ce96-41bb-aba6-fb5fc89f1afa.jpg',
          fullname: 'Nam Anh',
          username: 'trannamanh',
        },
      ],
      description: '**Nam Anh** posted in **EVOL Community**',
      content: 'https://www.beincom.io/posts/67e1319c-ee1d-466a-b479-0e939a2765be',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-17T11:24:32.963Z',
    updated_at: '2023-02-17T11:24:32.963Z',
  },
  {
    id: '3264e991-53c1-4e91-9529-e82ec04d8d9b',
    activities: [
      {
        id: '0564e053-1f01-42ab-a51e-5f239022cc8d',
        actor: {
          id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
          fullname: 'Trai tim anh tan nat vi em',
          username: 'lesison',
        },
        title: '',
        content: 'j',
        created_at: '2023-02-17T08:42:48.453Z',
        updated_at: '2023-02-17T08:42:48.453Z',
        content_type: 'post',
        reactions_count: {

        },
      },
    ],
    group: 'p-0564e053-1f01-42ab-a51e-5f239022cc8d:POST:POST:comment.to_post_creator',
    target: 'ARTICLE',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'comment.to_post_creator',
      actors: [
        {
          id: '32866f20-65f9-4580-86db-6d4f6388b8ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
          fullname: 'Trai tim anh tan nat vi em',
          username: 'lesison',
        },
      ],
      description: '**Trai tim anh tan nat vi em** posted in **EVOL Community**',
      content: 'j',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-17T09:33:55.383Z',
    updated_at: '2023-02-17T09:33:55.383Z',
  },
  {
    id: 'c31c0252-bfe7-4092-a37d-859261b89a14',
    activities: [
      {
        id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
        actor: {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        title: '',
        content: 'ửyseryesr',
        created_at: '2023-02-16T02:46:46.178Z',
        updated_at: '2023-02-16T02:46:46.178Z',
        content_type: 'post',
        reactions_count: {

        },
      },
    ],
    group: 'p-c90af979-e33f-433c-8121-1d37faba2d5f:POST:POST:post.to_user.in_multiple_groups',
    target: 'POST',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.to_user.in_multiple_groups',
      actors: [
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
      ],
      description: '**Linh Linh** posted in **3** groups',
      content: 'ửyseryesr',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-16T02:50:28.238Z',
    updated_at: '2023-02-16T02:50:28.238Z',
  },
  {
    id: '90b7abb9-8d04-405c-b568-50b74915873d',
    activities: [
      {
        id: 'b1de62a2-60a3-48ae-b354-6ade8ee44faf',
        actor: {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
        title: 'test Tag',
        content: '',
        created_at: '2023-02-15T04:57:09.101Z',
        updated_at: '2023-02-15T04:57:09.101Z',
        content_type: 'article',
        reactions_count: {

        },
      },
    ],
    group: 'p-b1de62a2-60a3-48ae-b354-6ade8ee44faf:POST:ARTICLE:post.article.to_user.in_one_group',
    target: 'ARTICLE',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.article.to_user.in_one_group',
      actors: [
        {
          id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
          fullname: 'Linh Linh',
          username: 'ngoclinh',
        },
      ],
      description: '**Linh Linh** created an article in **Test browse group123 với tên dài thật là dàiiiiiiiiiiiiiiiiiiiii**',
      content: 'test Tag',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-16T01:02:46.108Z',
    updated_at: '2023-02-16T01:02:46.108Z',
  },
  {
    id: '0d5a4c80-3681-49b9-acbf-ac582b9e638c',
    activities: [
      {
        id: '86e31172-b58b-410b-a7fd-45b98be30629',
        actor: {
          id: 'f28b0363-53f7-44ad-a59b-f20ed177bb73',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e4aecf44-4f76-478f-b180-eb8b7e0e96a2.jpg',
          fullname: 'Nguyễn Hoàng Gia Bảo',
          username: 'giabao',
        },
        title: 'WTFFFFFFFFFFFFF',
        content: '',
        created_at: '2023-02-10T09:13:41.058Z',
        updated_at: '2023-02-10T09:13:41.058Z',
        content_type: 'article',
        reactions_count: {

        },
      },
    ],
    group: 'p-86e31172-b58b-410b-a7fd-45b98be30629:POST:ARTICLE:post.article.to_user.in_multiple_groups',
    target: 'ARTICLE',
    verb: 'POST',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'post.article.to_user.in_multiple_groups',
      actors: [
        {
          id: 'f28b0363-53f7-44ad-a59b-f20ed177bb73',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e4aecf44-4f76-478f-b180-eb8b7e0e96a2.jpg',
          fullname: 'Nguyễn Hoàng Gia Bảo',
          username: 'giabao',
        },
      ],
      description: '**Nguyễn Hoàng Gia Bảo** created an article in **9** groups',
      content: 'WTFFFFFFFFFFFFF',
    },
    is_read: false,
    is_seen: true,
    created_at: '2023-02-16T00:39:16.771Z',
    updated_at: '2023-02-16T00:39:16.771Z',
  },
];

export const mockNotificationsWithNotType = [{
  ...mockNotifications[0],
  extra: {
    actors: [
      {
        id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
        avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
        fullname: 'Linh Linh',
        username: 'ngoclinh',
      },
      {
        id: '6235bc91-2255-4f4b-bcfa-bebcd24e37ac',
        avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6eewww4135f.jpg',
        fullname: 'Linh Linh 2',
        username: 'ngoclinh',
      },
    ],
    description: '**Linh Linh** created an article in **3** groups',
    content: 'test Article',
  },
}];

export const NOTI_HIDE_POST = {
  ownerReactions: [
    {
      id: '92b2d2bf-7588-4390-a9fe-7273450980af',
      postId: '2fca27cf-179c-466d-8653-7b699e804f6f',
      reactionName: 'bic_clapping_hands',
      createdBy: 'c14364d3-a26f-4393-b07b-e17a45c1edd2',
      createdAt: '2023-01-10T05:43:02.021Z',
    },
  ],
  id: '2fca27cf-179c-466d-8653-7b699e804f6f',
  content: 'test report 124545454555555566666783s',
  lang: 'en',
  media: {
    videos: [],
    images: [],
    files: [],
  },
  setting: {
    canReact: false,
    canComment: false,
    canShare: true,
    isImportant: false,
    importantExpiredAt: '2023-01-17T14:19:56.938Z',
  },
  status: 'PUBLISHED',
  actor: {
    id: 'c14364d3-a26f-4393-b07b-e17a45c1edd2',
    username: 'ptlw1',
    fullname: 'Tam Chieu Moi',
    avatar:
      'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/0019a7b5-8d7f-4f20-88cb-cbf2237ef77c.jpg',
    email: 'tamchieumoi@yopmail.com',
  },
  mentions: {},
  commentsCount: 1,
  totalUsersSeen: 3,
  reactionsCount: [],
  markedReadPost: true,
  isSaved: false,
  createdAt: '2023-01-09T04:19:28.654Z',
  updatedAt: '2023-01-16T14:34:01.179Z',
  createdBy: 'c14364d3-a26f-4393-b07b-e17a45c1edd2',
  audience: {
    groups: [
      {
        id: '33088ddf-089f-4834-a495-0ec40571a238',
        name: 'OutApp',
        icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
        privacy: 'OPEN',
        rootGroupId: '33088ddf-089f-4834-a495-0ec40571a238',
        communityId: '13b6985e-7599-413f-a3de-e2d724d5f28f',
        isCommunity: true,
        isReported: false,
      },
    ],
  },
  type: 'POST',
  privacy: 'OPEN',
  linkPreview: null,
  articles: [],
  communities: [
    {
      id: '33088ddf-089f-4834-a495-0ec40571a238',
      icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      name: 'OutApp',
      privacy: 'OPEN',
      communityId: '13b6985e-7599-413f-a3de-e2d724d5f28f',
    },
  ],
  tags: [],
  isReported: true,
  isHidden: true,
  title: null,
  summary: null,
  categories: [],
  views: 0,
  coverMedia: null,
  publishedAt: null,
  reportDetails: [
    {
      total: 1,
      reasonType: 'illegal',
      description: 'Illegal',
    },
    {
      total: 1,
      reasonType: 'others',
      description: 'Others',
    },
    {
      total: 1,
      reasonType: 'violent_or_porn',
      description: 'Violent, pornographic, or sexually explicit',
    },
  ],
};

export const NOTI_HIDE_COMMENT = {
  edited: false,
  totalReply: 1,
  ownerReactions: [],
  id: 'c6bb489c-d730-4ecb-a80e-3e1ffc06ab9b',
  actor: {
    id: 'c14364d3-a26f-4393-b07b-e17a45c1edd2',
    username: 'ptlw1',
    fullname: 'Tam Chieu Moi',
    avatar:
      'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/0019a7b5-8d7f-4f20-88cb-cbf2237ef77c.jpg',
    email: 'tamchieumoi@yopmail.com',
  },
  parentId: '00000000-0000-0000-0000-000000000000',
  postId: 'b7379b15-c1b7-473a-9e78-f1098b7c3e65',
  content: 'test rp comment',
  giphyId: '',
  createdAt: '2023-01-11T02:58:19.300Z',
  updatedAt: '2023-01-11T03:02:43.285Z',
  createdBy: 'c14364d3-a26f-4393-b07b-e17a45c1edd2',
  media: {
    videos: [],
    images: [],
    files: [],
  },
  reactionsCount: [],
  mentions: [],
  reportDetails: [
    {
      total: 2,
      reasonType: 'spam',
      description: 'Spam',
    },
  ],
};

export const mockNoti = {
  id: 'c31c0252-bfe7-4092-a37d-859261b89a14',
  activities: [
    {
      id: 'c90af979-e33f-433c-8121-1d37faba2d5f',
      comment: {
        id: 'test',
      },
      contentType: 'post',
    },
  ],
  extra: {
    type: 'comment.to_mentioned_user.in_comment',
    actors: [
      {
        id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
        avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/471e7f74-d3f2-4634-811a-c5d6ee94135f.jpg',
        fullname: 'Linh Linh',
        username: 'ngoclinh',
      },
    ],
    description: '**Linh Linh** posted in **3** groups',
    content: 'ửyseryesr',
  },
  updated_at: '2023-02-16T02:50:28.238Z',
};

export const mockChangeLogData = {
  code: 'api.ok',
  data: {
    id: 'a3100e1b-f682-46cc-a6b9-5e30807beba9',
    activities: [
      {
        actor: {
          id: '',
          avatar: '',
          fullname: '',
          username: '',
        },
        changelogsInfo: {
          title: 'QC test noti',
          content: "We're excited to announce the release of version ...\nHere's a quick preview of what's new in this version:\n\nThank you for your continued support, and we hope you enjoy the latest improvements!\n**BIC Team**",
        },
      },
    ],
    group: '65d538df-1898-4a89-913b-946fab99b379',
    target: 'USER',
    verb: 'NOTIFY',
    activity_count: 1,
    actor_count: 1,
    extra: {
      type: 'changelogs',
      actors: [
        {
          id: '',
          fullname: '',
          username: '',
          avatar: '',
        },
      ],
      description: '**A new version of BIC has been released!**',
      content: 'Please check the details for more information',
    },
    is_read: true,
    is_seen: true,
    created_at: '2023-07-06T02:43:37.766Z',
    updated_at: '2023-07-06T02:43:37.766Z',
  },
  meta: {
    message: 'OK',
  },
};
