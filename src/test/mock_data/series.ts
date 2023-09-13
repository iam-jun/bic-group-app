import { PostType } from '~/interfaces/IPost';

export const mockSeries = {
  owner_reactions: [],
  id: '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8',
  lang: null,
  title: 'series 111',
  titleHighlight: '==series== 111',
  summary: '',
  actor: {
    id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
    username: 'ngoclinh',
    fullname: 'Linh Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
    email: 'ngoclinh@tgm.vn',
  },
  commentsCount: 0,
  totalUsersSeen: 1,
  reactionsCount: [],
  createdAt: '2022-11-01T09:49:21.220Z',
  updatedAt: '2022-11-01T09:52:42.984Z',
  createdBy: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
  audience: {
    groups: [
      {
        id: 'eba85417-ec3e-49b4-89b4-c5393baecaaf',
        name: 'baobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaob',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/4224d221-3998-4963-892a-346d7522185f.webp',
        privacy: 'PUBLIC',
        communityId: 'e4b06eda-94d6-42d0-8829-d5380bc8f95b',
        isCommunity: true,
      },
      {
        id: 'eba85417-ec3e-49b4-89b4-c5393baecddf',
        name: 'Test',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/4224d221-3998-4963-892a-346d7522185f.webp',
        privacy: 'PUBLIC',
        communityId: 'b5c7a117-dcb8-47ba-9677-dc33da045bas',
        isCommunity: false,
      },
    ],
  },
  comments: {
    list: [],
    meta: {
      limit: 5,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  coverMedia: {
    id: '8acbba55-4054-4aae-986b-aa6a63708877',
    url: 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/f6bd62ee-ccec-4526-9b99-376861ad9426.jpeg',
    type: 'image',
    createdBy: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
    name: 'f6bd62ee-ccec-4526-9b99-376861ad9426.jpeg',
    originName: 'richard-horvath-_nWaeTF6qo0-unsplash.jpeg',
    width: 5120,
    height: 2880,
    extension: 'jpeg',
    status: 'completed',
    size: 336699,
    mimeType: 'image/jpeg',
    thumbnails: null,
    createdAt: '2022-07-26T10:26:10.737Z',
  },
};

export const mockSeriesWithSummary = {
  owner_reactions: [],
  id: '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8',
  lang: null,
  title: 'series 111',
  summary: 'summary',
  summaryHighlight: '==summary==',
  actor: {
    id: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
    username: 'ngoclinh',
    fullname: 'Linh Linh',
    avatar:
      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
    email: 'ngoclinh@tgm.vn',
  },
  comments_count: 0,
  total_users_seen: 1,
  reactions_count: {},
  created_at: '2022-11-01T09:49:21.220Z',
  updated_at: '2022-11-01T09:52:42.984Z',
  created_by: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
  audience: {
    groups: [
      {
        id: 'eba85417-ec3e-49b4-89b4-c5393baecaaf',
        name: 'baobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaobaob',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/4224d221-3998-4963-892a-346d7522185f.webp',
        privacy: 'PUBLIC',
        community_id: 'b5c7a117-dcb8-47ba-9677-dc33da0320ba',
        is_community: true,
      },
    ],
  },
  comments: {
    list: [],
    meta: {
      limit: 5,
      offset: 0,
      has_next_page: false,
      has_previous_page: false,
    },
  },
  cover_media: {
    id: '8acbba55-4054-4aae-986b-aa6a63708877',
    url: 'https://bein-user-sharing-assets-sandbox.s3.ap-southeast-1.amazonaws.com/post/images/original/f6bd62ee-ccec-4526-9b99-376861ad9426.jpeg',
    type: 'image',
    created_by: '6235bc91-2255-4f4b-bcfa-bebcd24e27ac',
    name: 'f6bd62ee-ccec-4526-9b99-376861ad9426.jpeg',
    origin_name: 'richard-horvath-_nWaeTF6qo0-unsplash.jpeg',
    width: 5120,
    height: 2880,
    extension: 'jpeg',
    status: 'completed',
    size: 336699,
    mime_type: 'image/jpeg',
    thumbnails: null,
    created_at: '2022-07-26T10:26:10.737Z',
  },
};

export const mockSeriesResponseRemovedAudiences = {
  ...mockSeries,
  audience: {
    groups: [
      {
        id: 'eba85417-ec3e-49b4-89b4-c5393baecddf',
        name: 'Test',
        icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/4224d221-3998-4963-892a-346d7522185f.webp',
        privacy: 'PUBLIC',
        community_id: 'b5c7a117-dcb8-47ba-9677-dc33da045bas',
        is_community: true,
      },
    ],
  },
};

export const mockSeriesRequest = {
  audience: {
    user_ids: [],
    group_ids: [
      'eba85417-ec3e-49b4-89b4-c5393baecaaf',
    ],
  },
  title: 'series 111',
  summary: '',
  coverMedia: {
    id: '8acbba55-4054-4aae-986b-aa6a63708877',
  },
};

export const listArticle = [
  {
    id: '1',
    title:
      'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
    summary:
    'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
    coverMedia: {
      url: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
    },
    actor: {
      id: '05ba7d6d-70d6-4c19-b304-7adf8d0d5218',
      username: 'bicbotnotice2',
      fullname: 'Wall-E',
      avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e69febe3-5962-41f9-9258-3a8579f3b0ab',
      email: 'bicnoticebot2@mailinator.com',
    },
    updatedAt: '2022-11-03T07:36:28.870Z',
    type: PostType.ARTICLE,
  },
  {
    id: '2',
    title: 'Be The First Line List Series.',
    summary:
    'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
    coverMedia: {
      url: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
    },
    actor: {
      id: '05ba7d6d-70d6-4c19-b304-7adf8d0d5218',
      username: 'bicbotnotice2',
      fullname: 'Wall-E',
      avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e69febe3-5962-41f9-9258-3a8579f3b0ab',
      email: 'bicnoticebot2@mailinator.com',
    },
    updatedAt: '2022-11-03T07:36:28.870Z',
    type: PostType.POST,
  },
  {
    id: '3',
    title: 'Be The First Line List Series.',
    summary:
    'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
    coverMedia: {
      url: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
    },
    actor: {
      id: '05ba7d6d-70d6-4c19-b304-7adf8d0d5218',
      username: 'bicbotnotice2',
      fullname: 'Wall-E',
      avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e69febe3-5962-41f9-9258-3a8579f3b0ab',
      email: 'bicnoticebot2@mailinator.com',
    },
    updatedAt: '2022-11-03T07:36:28.870Z',
  },
];

export const article = {
  id: '5723b74c-8500-4c97-9fae-94c172745f4a',
  title:
    'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
  summary:
    'Be The First Line List Series. Be The First Line List Series. Be The First Line List Series.',
  coverMedia: {
    url: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/91fae044-2182-47eb-97fb-c9e0bb6e5e6a.webp',
  },
  actor: {
    id: '05ba7d6d-70d6-4c19-b304-7adf8d0d5218',
    username: 'bicbotnotice2',
    fullname: 'Wall-E',
    avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e69febe3-5962-41f9-9258-3a8579f3b0ab',
    email: 'bicnoticebot2@mailinator.com',
  },
  updatedAt: '2022-11-03T07:36:28.870Z',
};

export const mockImageFile = {
  filename: '1BB19122-DB2B-4FFD-94AF-CE6B397814DA.jpg',
  height: 2002,
  mime: 'image/jpeg',
  name: '1BB19122-DB2B-4FFD-94AF-CE6B397814DA.jpg',
  size: 1544169,
  type: 'image/jpeg',
  uri: '/Users/quyenthu/Library/Developer/CoreSimulator/Devices/81CF0236-1C85-4C14-95F0-863957B0ABFD/data/Containers/Data/Application/BFC141B1-186D-40E4-82A6-45788C69FB2A/tmp/react-native-image-crop-picker/1BB19122-DB2B-4FFD-94AF-CE6B397814DA.jpg',
  width: 3000,
};

export const mockListSeriesOfArticle = [
  {
    id: 'b55cf275-d728-44a3-ba5e-cd17ab30cf6d',
    title: 'Test comment + react',
    audience: {
      groups: [
        {
          is_community: true,
          community_id: 'e4b06eda-94d6-42d0-8829-d5380bc8f95b',
          id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf99',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/c015b7d3-7bf1-4b0e-9ca4-b73d3a7ff82e.jpg',
          name: 'Community.của.Linh',
          privacy: 'PUBLIC',
          root_group_id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf99',
        },
        {
          is_community: true,
          community_id: 'e4b8bf37-a218-4f73-bdfd-60b6b329852b',
          id: '8b103e63-0714-40bb-9f33-01a8a26fea77',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
          name: 'The Rock Crew',
          privacy: 'PUBLIC',
          root_group_id: '8b103e63-0714-40bb-9f33-01a8a26fea77',
        },
      ],
    },
  },
  {
    id: 'b55cf275-d728-44a3-ba5e-333333333',
    title: 'Test series so longgggggggggggggggg kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    audience: {
      groups: [
        {
          is_community: true,
          community_id: 'e4b06eda-94d6-42d0-8829-d5380bc8f95b',
          id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf99',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/c015b7d3-7bf1-4b0e-9ca4-b73d3a7ff82e.jpg',
          name: 'Community.của.Linh',
          privacy: 'PUBLIC',
          root_group_id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf99',
        },
        {
          is_community: true,
          community_id: 'e4b8bf37-a218-4f73-bdfd-60b6b329852b',
          id: '8b103e63-0714-40bb-9f33-01a8a26fea77',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
          name: 'The Rock',
          privacy: 'PUBLIC',
          root_group_id: '8b103e63-0714-40bb-9f33-01a8a26fea77',
        },
        {
          is_community: true,
          community_id: 'e4b06eda-94d6-42d0-8829-d5380bc8f95b222',
          id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf998',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/c015b7d3-7bf1-4b0e-9ca4-b73d3a7ff82e.jpg',
          name: 'Community.của.Linh1',
          privacy: 'PUBLIC',
          root_group_id: 'e1cb33cf-ef6e-4d13-97d9-23ee95b7bf99',
        },
        {
          is_community: true,
          community_id: 'e4b8bf37-a218-4f73-bdfd-44444',
          id: '8b103e63-0714-40bb-9f33-01a8a26fea778',
          icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
          name: 'The Rock Creweeeuhwfhwehghekghkehgrhekjrhgkerhkghekrglejlrghkeljrglherklgjlrglejlgjrlgjlrjkglrj',
          privacy: 'PUBLIC',
          root_group_id: '8b103e63-0714-40bb-9f33-01a8a26fea77',
        },
      ],
    },
  },
];

export const selectedSeries = [
  {
    id: 'b55cf275-d728-44a3-ba5e-cd17ab30cf6d',
    title: 'Test comment + react',
  },
];

export const searchSeriesRequestParams = {
  groupIds: ['e4b06eda-94d6-42d0-8829-d5380bc8f95b',
    'e4b8bf37-a218-4f73-bdfd-60b6b329852b'],
};

export const seriesWithItemsResponse = {
  code: 'api.ok',
  data: {
    series: [
      {
        id: '69a74407-023f-468e-a463-4bc1ebcd4bf7',
        title: 'Navigate next or previous content in a series 01',
        type: 'SERIES',
        items: [
          {
            id: 'b7a13ec4-e1f5-48fe-bd9f-2953b0d44e78',
            title: 'Article 05 - Vị trí số 4 của series 01, 02, 03',
            type: 'ARTICLE',
          },
          {
            id: 'c46bb2fb-61d6-4981-bde0-d54d12ea7e13',
            title: 'Article 06 - Vị trí số 5 của series 01+02, không thuộc series 03',
            type: 'ARTICLE',
          },
          {
            id: '087c8e1f-86a1-4e87-a2f2-e8fcf015b52e',
            title: '许诺',
            type: 'ARTICLE',
          },
        ],
      },
    ],
  },
  meta: {
    message: 'OK',
  },
};

export const seriesDetail = {
  code: 'api.ok',
  data: {
    items: [
      {
        id: 'b841049d-d13c-4cf4-9dd2-5080e51675ff',
        title: 'Sự khác nhau giữa BA và PO',
        summary: 'Chia sẻ từ góc nhìn của người trong ngành (Phần 2)',
        type: 'ARTICLE',
        createdAt: '2022-11-28T07:24:34.737Z',
        publishedAt: '2022-11-28T07:24:34.737Z',
        setting: {
          isImportant: false,
          importantExpiredAt: null,
          canComment: true,
          canReact: true,
        },
        actor: {
          id: '18c63de1-8c5a-43bb-95a3-a3a05fd4126f',
          username: 'tuyet3',
          fullname: 'Trần Nhật Thành',
          email: 'tuyet3@mailinator.com',
          avatar: 'https://media.beincom.app/image/variants/user/avatar/33ba0992-1d70-45ca-b9f3-d9434d6f36b2',
          isDeactivated: false,
          isVerified: false,
          showingBadges: [
            {
              id: '7de5b536-ef96-42e0-8055-77d35fbc90cf',
              name: "Tesler's Law",
              iconUrl: 'https://media.beincom.app/image/variants/badge/b8fb7449-f865-4c8d-a8ae-65f70452ce8e',
              community: {
                id: 'ce60c943-23e5-48bb-a296-57c58484042f',
                name: 'Linkin Park Addicted Station',
              },
            },
            {
              id: '98edbc8d-1608-47e8-a9fd-24dee9aeb927',
              name: 'test',
              iconUrl: 'https://media.beincom.app/image/animation/variants/badge/80ae500a-80b7-4125-b90b-2c047549c2d8',
              community: {
                id: 'c9c09bce-26a6-4824-9fc9-37004dafdcc1',
                name: 'Cộng đồng test CIC 25555',
              },
            },
          ],
        },
        isSaved: false,
        coverMedia: {
          id: 'cfa34edb-60df-4a56-8a21-e804a0c97cb9',
          src: '/image/variants/article/cover/cfa34edb-60df-4a56-8a21-e804a0c97cb9',
          url: 'https://media.beincom.app/image/variants/article/cover/cfa34edb-60df-4a56-8a21-e804a0c97cb9',
          width: 797,
          height: 474,
          mimeType: 'image/webp',
          resource: 'article:cover',
        },
        categories: [
          {
            id: '37682095-ca90-4eb9-9b13-effae30cb74a',
            name: 'Technology',
          },
          {
            id: '55d283d6-91be-4d28-ad61-8ce683fda4ab',
            name: 'Others',
          },
        ],
      },
      {
        id: 'e70676c6-5a2c-463a-91bf-1963edc6050d',
        title: 'THÔNG TIN TRƯỚC KHI TUYỂN SINH<',
        summary: 'aaaaaa',
        type: 'ARTICLE',
        createdAt: '2022-11-30T09:53:31.823Z',
        publishedAt: '2022-11-30T09:53:31.823Z',
        setting: {
          isImportant: false,
          importantExpiredAt: null,
          canComment: true,
          canReact: true,
        },
        actor: {
          id: '18c63de1-8c5a-43bb-95a3-a3a05fd4126f',
          username: 'tuyet3',
          fullname: 'Trần Nhật Thành',
          email: 'tuyet3@mailinator.com',
          avatar: 'https://media.beincom.app/image/variants/user/avatar/33ba0992-1d70-45ca-b9f3-d9434d6f36b2',
          isDeactivated: false,
          isVerified: false,
          showingBadges: [
            {
              id: '7de5b536-ef96-42e0-8055-77d35fbc90cf',
              name: "Tesler's Law",
              iconUrl: 'https://media.beincom.app/image/variants/badge/b8fb7449-f865-4c8d-a8ae-65f70452ce8e',
              community: {
                id: 'ce60c943-23e5-48bb-a296-57c58484042f',
                name: 'Linkin Park Addicted Station',
              },
            },
            {
              id: '98edbc8d-1608-47e8-a9fd-24dee9aeb927',
              name: 'test',
              iconUrl: 'https://media.beincom.app/image/animation/variants/badge/80ae500a-80b7-4125-b90b-2c047549c2d8',
              community: {
                id: 'c9c09bce-26a6-4824-9fc9-37004dafdcc1',
                name: 'Cộng đồng test CIC 25555',
              },
            },
          ],
        },
        isSaved: false,
        coverMedia: {
          id: '3b2c559e-bf91-4008-a8fa-a0ac45358570',
          src: '/image/variants/article/cover/3b2c559e-bf91-4008-a8fa-a0ac45358570',
          url: 'https://media.beincom.app/image/variants/article/cover/3b2c559e-bf91-4008-a8fa-a0ac45358570',
          width: 738,
          height: 466,
          mimeType: 'image/webp',
          resource: 'article:cover',
        },
        categories: [
          {
            id: 'fea16424-4674-49ea-8948-e1b878611b0c',
            name: 'Fashion & Beauty',
          },
        ],
      },
      {
        id: 'f4c8a5e7-b0c3-4015-bec8-506eef61929a',
        title: 'Fffff',
        summary: '',
        type: 'ARTICLE',
        createdAt: '2022-12-30T10:28:53.412Z',
        publishedAt: '2022-12-30T10:28:53.412Z',
        setting: {
          isImportant: false,
          importantExpiredAt: null,
          canComment: true,
          canReact: true,
        },
        actor: {
          id: '7e2dc2f3-408c-4d65-9c21-d7a0ca464ad1',
          username: 'hieuthao',
          fullname: 'Hiếu Thảo',
          email: 'hieuthao@tgm.vn',
          avatar: 'https://media.beincom.app/image/variants/user/avatar/0c4cd652-f5e6-46ed-80cb-71dcb440bbbc',
          isDeactivated: false,
          isVerified: true,
          showingBadges: [],
        },
        isSaved: false,
        coverMedia: {
          id: '1491de45-61bf-4abc-acf8-fd757de44009',
          src: '/image/variants/article/cover/1491de45-61bf-4abc-acf8-fd757de44009',
          url: 'https://media.beincom.app/image/variants/article/cover/1491de45-61bf-4abc-acf8-fd757de44009',
          width: 1080,
          height: 1080,
          mimeType: 'image/webp',
          resource: 'article:cover',
        },
        categories: [
          {
            id: '014b27fb-8596-418e-b12b-f5ce0532b727',
            name: 'Travel',
          },
          {
            id: '1ed0cc5e-d183-437d-97ea-0ce28950ea50',
            name: 'Fitness',
          },
          {
            id: '37dcf65a-5355-4b6e-b970-56e01293cd9a',
            name: 'Business & Finance',
          },
          {
            id: '4bc6f3de-2bac-4d58-a597-4c99f127307f',
            name: 'Food',
          },
          {
            id: '4efd621a-2d0b-4a7b-871d-dbd1ca6dadff',
            name: 'Family & Relationships',
          },
          {
            id: '502033d1-71ec-4aec-8549-c60e672200ca',
            name: 'Outdoors',
          },
          {
            id: '8b055774-826d-4864-9c38-e1ca12736930',
            name: 'Sports',
          },
          {
            id: '8b658e41-dd79-4990-8e86-893cef381cd7',
            name: 'Music',
          },
          {
            id: '9a9db2f9-cac7-4223-ac83-23a079a9c4f3',
            name: 'Gaming',
          },
          {
            id: '9bdb0880-fe25-41fc-a7db-b8184554f209',
            name: 'Entertainment',
          },
          {
            id: 'a4542828-d26b-4722-b993-8d697295f125',
            name: 'Arts & Culture',
          },
          {
            id: 'c8fbfe86-dce2-4ad4-84a1-8d3877a90bc1',
            name: 'Animation & Comics',
          },
          {
            id: 'fcbcfeb9-8ddb-4018-81ce-719f05752920',
            name: 'Careers',
          },
          {
            id: 'fea16424-4674-49ea-8948-e1b878611b0c',
            name: 'Fashion & Beauty',
          },
        ],
      },
    ],
    id: 'f0f9d2ed-5997-4f27-8a68-7666b8418259',
    title: 'So sánh BA và Product Owner11',
    summary: 'Series about compare BA & PO',
    audience: {
      groups: [
        {
          id: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
          name: 'Cộng đồng học đầu tư CK 13124',
          icon: 'https://media.beincom.app/image/variants/group/avatar/05eb182f-8066-4b1b-882d-77659d07e845',
          communityId: '1e3febd6-b3c5-4e97-b493-b64caf834764',
          isCommunity: true,
          privacy: 'OPEN',
          rootGroupId: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
        },
      ],
    },
    createdAt: '2022-11-29T03:02:25.610Z',
    updatedAt: '2023-08-24T07:30:05.517Z',
    publishedAt: '2022-11-29T03:02:25.610Z',
    createdBy: '18c63de1-8c5a-43bb-95a3-a3a05fd4126f',
    coverMedia: {
      id: '5ab10803-41f5-4c26-8ff5-7dc4ed96fa82',
      src: '/image/variants/series/cover/5ab10803-41f5-4c26-8ff5-7dc4ed96fa82',
      url: 'https://media.beincom.app/image/variants/series/cover/5ab10803-41f5-4c26-8ff5-7dc4ed96fa82',
      width: 770,
      height: 400,
      mimeType: 'image/webp',
      resource: 'series:cover',
    },
    communities: [
      {
        id: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
        name: 'Cộng đồng học đầu tư CK 13124',
        icon: 'https://media.beincom.app/image/variants/group/avatar/05eb182f-8066-4b1b-882d-77659d07e845',
        communityId: '1e3febd6-b3c5-4e97-b493-b64caf834764',
        isCommunity: true,
        privacy: 'OPEN',
        rootGroupId: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
      },
    ],
    actor: {
      id: '18c63de1-8c5a-43bb-95a3-a3a05fd4126f',
      username: 'tuyet3',
      fullname: 'Trần Nhật Thành',
      email: 'tuyet3@mailinator.com',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/33ba0992-1d70-45ca-b9f3-d9434d6f36b2',
      isDeactivated: false,
      isVerified: false,
      showingBadges: [
        {
          id: '7de5b536-ef96-42e0-8055-77d35fbc90cf',
          name: "Tesler's Law",
          iconUrl: 'https://media.beincom.app/image/variants/badge/b8fb7449-f865-4c8d-a8ae-65f70452ce8e',
          community: {
            id: 'ce60c943-23e5-48bb-a296-57c58484042f',
            name: 'Linkin Park Addicted Station',
          },
        },
        {
          id: '98edbc8d-1608-47e8-a9fd-24dee9aeb927',
          name: 'test',
          iconUrl: 'https://media.beincom.app/image/animation/variants/badge/80ae500a-80b7-4125-b90b-2c047549c2d8',
          community: {
            id: 'c9c09bce-26a6-4824-9fc9-37004dafdcc1',
            name: 'Cộng đồng test CIC 25555',
          },
        },
      ],
    },
    status: 'PUBLISHED',
    type: 'SERIES',
    privacy: 'OPEN',
    isHidden: false,
    setting: {
      isImportant: false,
      importantExpiredAt: null,
      canComment: true,
      canReact: true,
    },
    commentsCount: 0,
    totalUsersSeen: 0,
    markedReadPost: false,
    isSaved: false,
    isReported: false,
  },
  meta: {
    message: 'OK',
  },
};
