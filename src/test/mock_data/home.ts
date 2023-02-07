import { PostStatus } from '~/interfaces/IPost';

export const feedData = {
  data: [
    '1cc6669f-6c3d-486c-af0d-a2b833a9886d',
    '853ba63f-7543-49f8-96ee-193f11888c0b',
    '5f72df32-83d4-446d-bbd8-f7cc0da5df6c',
    '9126e1d1-2c2e-4661-801a-f24c7f944284',
    '256d4e02-00d2-4a27-b5c9-41a3c6fb7d80',
    '2b6f5b63-77a1-4653-a884-bf8a37d988d3',
    '63d48cb1-82f2-4fae-9af5-1de45cf86cea',
    'fa33dfcd-86ba-42b8-8614-a932632f6079',
    '3c348823-b2f5-498c-9931-d1e51225a58f',
    '9c3c1a9c-1faa-464b-9331-ac1c6ec3c760',
    '16764176-e194-4f4c-b2da-33f5466d7018',
    'c92451df-a74f-492f-a77d-5173834efc3c',
    '6461eb34-2f16-4cac-9b60-26e461823460',
    '50ad1616-96de-4faa-b8db-81ed9e3b7362',
    '46baef84-57f7-4e28-8104-e0e0302d68d8',
    'b6de0e11-a839-4e2b-a9e9-1dd74cea4da7',
    '9212a76b-022e-46c0-8ad1-97056b32865f',
    '682263ca-8f6a-4fbd-a22c-76be8aa4a0c8',
    'fee66189-7c76-4021-b876-375469aa955f',
    'd56a9739-eedf-4eeb-a466-4a2f722508f7',
    '87be005b-3c2a-4749-abb2-1ebe8eea612a',
    '1d858325-bda8-47f7-a21e-18851a288ffa',
    'b09d3c53-8694-4d1d-baf7-bfea71a5fb67',
    'f034f8fc-75f1-4fa7-9213-075434d56d74',
    'e8228ef7-4ab4-45f6-a9b1-6a8e732eefa2',
  ],
  refreshing: false,
  isLoading: false,
  canLoadMore: true,
};

// /feed/feeds/newsfeed?order=DESC&offset=0&is_important=false
export const mockDataFeedResponse = {
  list: [
    {
      ownerReactions: [],
      id: '1cc6669f-6c3d-486c-af0d-a2b833a9886d',
      content: null,
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
      status: PostStatus.PUBLISHED,
      isProcessing: false,
      actor: {
        id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
        username: 'ngoclinh',
        fullname: 'Linh Linh',
        avatar: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
        email: 'ngoclinh@tgm.vn',
      },
      mentions: [],
      commentsCount: 0,
      totalUsersSeen: 2,
      reactionsCount: [
        {
          bicPurpleHeart: 1,
        },
      ],
      markedReadPost: false,
      createdAt: '2022-11-04T08:49:14.763Z',
      updatedAt: '2022-11-04T12:00:51.290Z',
      createdBy: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
      audience: {
        groups: [
          {
            isCommunity: true,
            communityId: 'ce58beb6-6b0d-414b-ab0b-a5f37bebe68f',
            id: '91830f8b-3ab1-4899-8811-c4d18af457b5',
            icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a5f52b92-9e6a-4ff9-9420-c14861d1be16.jpg',
            name: 'Bock Bock',
            privacy: 'PUBLIC',
            rootGroupId: '91830f8b-3ab1-4899-8811-c4d18af457b5',
          },
        ],
      },
      type: 'SERIES',
      privacy: null,
      linkPreview: null,
      title: 'edit tên',
      summary: 'đã edit',
      categories: [],
      views: 0,
      coverMedia: {
        id: 'efc6e4a9-cd63-4c9a-83dd-694a9338c220',
        url: 'https://bic-dev-user-sharing-assets-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/images/original/0710a653-ca01-4ec7-9ceb-6fbf6f305520.jpg',
        type: 'image',
        createdBy: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
        name: '0710a653-ca01-4ec7-9ceb-6fbf6f305520.jpg',
        originName: 'c339a503-ff67-45f9-a9b9-526e66bbb3cb.jpg',
        width: 1920,
        height: 1080,
        extension: 'jpeg',
        status: 'completed',
        size: 1297155,
        mimeType: 'image/jpeg',
        thumbnails: null,
        createdAt: '2022-11-04T12:00:48.089Z',
      },
    },
    {
      ownerReactions: [],
      id: '853ba63f-7543-49f8-96ee-193f11888c0b',
      content: [{ type: 'p', children: [{ text: 'fadfadfaf' }] }],
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
      status: PostStatus.PUBLISHED,
      isProcessing: false,
      actor: {
        id: '077d4420-3c80-41d9-89ec-0da039657629',
        username: 'phuongkhanh',
        fullname: 'Huỳnh Phương Khanh',
        avatar: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/ace499de-6bdb-48ee-a7d0-5c69e996c192.jpg',
        email: 'phuongkhanh@tgm.vn',
      },
      mentions: [],
      commentsCount: 0,
      totalUsersSeen: 0,
      reactionsCount: [],
      markedReadPost: false,
      createdAt: '2022-11-04T04:47:53.613Z',
      updatedAt: '2022-11-04T04:47:53.896Z',
      createdBy: '077d4420-3c80-41d9-89ec-0da039657629',
      audience: {
        groups: [
          {
            isCommunity: true,
            communityId: '03ad6513-3c1d-4c87-b7da-c282321d5c67',
            id: '8f914eaa-821f-44b8-80e0-7bac69346397',
            icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
            name: 'Right Thinking',
            privacy: 'PUBLIC',
            rootGroupId: '8f914eaa-821f-44b8-80e0-7bac69346397',
          },
        ],
      },
      type: 'ARTICLE',
      privacy: 'PUBLIC',
      linkPreview: null,
      title: 'title 1 nè',
      summary: 'Description',
      categories: [
        {
          id: '0d58df6d-d30a-45ea-bbbd-eeab54ec3dbc',
          name: 'Fashion & Beauty',
        },
        {
          id: '2bbb37b8-37e9-4b3d-adc3-4e401bfc0e39',
          name: 'Outdoors',
        },
      ],
      views: 0,
      coverMedia: {
        id: 'da54b189-b7ba-4482-90fb-ba9280af36b7',
        url: 'https://bic-dev-user-sharing-assets-s3-bucket.s3.ap-southeast-1.amazonaws.com/post/images/original/490916de-dbac-400d-bc55-c89aaa6763b0.jpeg',
        type: 'image',
        createdBy: '077d4420-3c80-41d9-89ec-0da039657629',
        name: '490916de-dbac-400d-bc55-c89aaa6763b0.jpeg',
        originName: 'dog_1.jpeg',
        width: 1200,
        height: 602,
        extension: 'jpeg',
        status: 'completed',
        size: 80864,
        mimeType: 'image/jpeg',
        thumbnails: null,
        createdAt: '2022-11-03T09:05:10.408Z',
      },
    },
  ],
  meta: {
    limit: 2,
    offset: 0,
    hasNextPage: true,
  },
};

export const recentSearchKeywords = {
  target: 'post',
  recentSearches: [
    {
      id: '88e17c1e-5065-4081-b837-f76cfd20439b',
      keyword: 'hu',
    },
    {
      id: 'b3779916-21ac-4ca3-a192-e7e5ee19e499',
      keyword: 'k',
    },
    {
      id: '788cb89d-1153-41d7-88af-4f47174d35b0',
      keyword: 'testasd',
    },
    {
      id: '61d374ab-63b8-4e3d-aa13-bc82d3bca738',
      keyword: 'hihi',
    },
    {
      id: 'dee5db07-0479-412e-812f-ad22ea268542',
      keyword: 'sssssss',
    },
    {
      id: '37f1aff4-50c5-414d-a0ea-b75745928137',
      keyword: 'tétasd',
    },
    {
      id: '3ea49ce2-8b6f-4825-894a-ef1a4d071b58',
      keyword: 'tests add',
    },
    {
      id: 'bfffc767-6b6c-4bef-9512-c03ff27d1298',
      keyword: 'serries cua tui',
    },
    {
      id: 'ae3ee283-fb07-4822-824a-4b725358d7e4',
      keyword: 'serries',
    },
    {
      id: '01e4c862-bf76-463a-a625-ade3a71552bd',
      keyword: 'serried',
    },
  ],
};

export const responseSearchPost = {
  list: [
    {
      id: 'a52fe0b0-b2d8-4b7c-845e-3faeb921cb12',
      type: 'POST',
      createdAt: '2022-06-06T04:56:19.855Z',
      createdBy: '45a7942e-0369-4c78-9915-1aeb46463172',
      coverMedia: null,
      media: {
        files: [],
        videos: [],
        images: [],
      },
      content: "Hư cấu quá :'( @ngoclinh ",
      title: null,
      summary: null,
      categories: [],
      articles: [],
      tags: [],
      highlight: "==Hư== cấu quá :'( @ngoclinh ",
      commentsCount: 0,
      totalUsersSeen: 6,
      setting: {
        importantExpiredAt: null,
        isImportant: false,
        canReact: true,
        canShare: true,
        canComment: true,
      },
      reactionsCount: [
        {
          grinning: 3,
        },
        {
          grinningFaceWithStarEyes: 3,
        },
        {
          heartEyes: 3,
        },
        {
          kissing: 4,
        },
        {
          kissingClosedEyes: 2,
        },
        {
          kissingSmilingEyes: 2,
        },
        {
          yum: 2,
        },
        {
          upsideDownFace: 2,
        },
        {
          rollingOnTheFloorLaughing: 2,
        },
      ],
      audience: {
        groups: [
          {
            id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
            name: 'EVOL Community',
            communityId: '15337361-1577-4b7b-a31d-990df06aa446',
            icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
            privacy: 'OPEN',
            isCommunity: true,
            rootGroupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
          },
        ],
      },
      communities: [
        {
          id: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
          name: 'EVOL Community',
          communityId: '15337361-1577-4b7b-a31d-990df06aa446',
          icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/26a806d3-3557-4f7a-b96a-132a9befccff',
          privacy: 'OPEN',
        },
      ],
      actor: {
        id: '45a7942e-0369-4c78-9915-1aeb46463172',
        fullname: 'Thân Thế Văn',
        email: 'thevan@tgm.vn',
        username: 'thanthevan',
        avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/206550db-26f1-4115-80dc-98134e4d8590.webp',
      },
      mentions: [],
    },
  ],
  meta: {
    total: 1,
    limit: 25,
    offset: 0,
  },
};
