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
        id: '6befcaeb-2bae-43c3-b36e-bfe61af806b1',
        content: 'Membership approval was automatically turned on for \\*inner1\\* due to a privacy change in \\*Group1\\* by _Andy Nguyen_.\n\nTimestamp: [Thời gian]',
        createdAt: '2023-08-15T11:17:24.708Z',
        publishedAt: '2023-08-15T11:17:29.167Z',
        setting: {
          isImportant: false,
          importantExpiredAt: null,
          canComment: true,
          canReact: true,
        },
        type: 'POST',
        actor: {
          id: 'b4313683-bc44-463a-9e85-d1d77ec69ff1',
          username: 'tuyet2',
          fullname: 'Đỗ Thị Tuyết 2',
          email: 'tuyet2@mailinator.com',
          avatar: 'https://media.beincom.app/image/variants/user/avatar/6f85f497-fa89-4013-ab6a-586d9163564c',
          isDeactivated: false,
          isVerified: true,
          showingBadges: [
            {
              id: 'd7f5b806-ed26-47dd-ae9a-b488bfcec9a9',
              name: '23',
              iconUrl: 'https://media.beincom.app/image/variants/badge/ded44889-fac3-47cd-a99b-84c76666e16a',
              community: {
                id: '8e6b39d2-5bc0-4a82-bf81-f90509080c47',
                name: 'BA_tuyet2',
              },
            },
            {
              id: '80033db5-dda8-4f2e-b473-6563697c0fde',
              name: 'BIC whales',
              iconUrl: 'https://media.beincom.app/image/variants/badge/cd3ce7ed-510a-4b3e-9a7e-c0725fad3d9f',
              community: {
                id: '8e6b39d2-5bc0-4a82-bf81-f90509080c47',
                name: 'BA_tuyet2',
              },
            },
          ],
        },
        isSaved: false,
        media: {
          files: [],
          images: [],
          videos: [],
        },
      },
    ],
    id: 'e2e1e557-adbb-4c75-872a-3bf18f817f1e',
    title: 'Các loài hoa',
    summary: 'Hoa  tuyết',
    audience: {
      groups: [
        {
          id: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
          name: 'Cộng đồng học đầu tư CK',
          icon: 'https://media.beincom.app/image/variants/group/avatar/05eb182f-8066-4b1b-882d-77659d07e845',
          communityId: '1e3febd6-b3c5-4e97-b493-b64caf834764',
          isCommunity: true,
          privacy: 'OPEN',
          rootGroupId: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
        },
      ],
    },
    createdAt: '2023-05-08T11:43:37.698Z',
    updatedAt: '2023-08-03T15:44:45.987Z',
    publishedAt: '2023-05-08T11:43:37.698Z',
    createdBy: 'b4313683-bc44-463a-9e85-d1d77ec69ff1',
    coverMedia: {
      id: 'bde606b6-e11c-4a67-b27f-3c819c52ef5c',
      src: '/image/variants/series/cover/bde606b6-e11c-4a67-b27f-3c819c52ef5c',
      url: 'https://media.beincom.app/image/variants/series/cover/bde606b6-e11c-4a67-b27f-3c819c52ef5c',
      width: 1024,
      height: 768,
      status: 'DONE',
      mimeType: 'image/jpeg',
      resource: 'series:cover',
      createdBy: 'b4313683-bc44-463a-9e85-d1d77ec69ff1',
    },
    communities: [
      {
        id: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
        name: 'Cộng đồng học đầu tư CK',
        icon: 'https://media.beincom.app/image/variants/group/avatar/05eb182f-8066-4b1b-882d-77659d07e845',
        communityId: '1e3febd6-b3c5-4e97-b493-b64caf834764',
        isCommunity: true,
        privacy: 'OPEN',
        rootGroupId: 'f84e82b5-18c6-4291-8f3a-9bf4da714e99',
      },
    ],
    actor: {
      id: 'b4313683-bc44-463a-9e85-d1d77ec69ff1',
      username: 'tuyet2',
      fullname: 'Đỗ Thị Tuyết 2',
      email: 'tuyet2@mailinator.com',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/6f85f497-fa89-4013-ab6a-586d9163564c',
      isDeactivated: false,
      isVerified: true,
      showingBadges: [
        {
          id: 'd7f5b806-ed26-47dd-ae9a-b488bfcec9a9',
          name: '23',
          iconUrl: 'https://media.beincom.app/image/variants/badge/ded44889-fac3-47cd-a99b-84c76666e16a',
          community: {
            id: '8e6b39d2-5bc0-4a82-bf81-f90509080c47',
            name: 'BA_tuyet2',
          },
        },
        {
          id: '80033db5-dda8-4f2e-b473-6563697c0fde',
          name: 'BIC whales',
          iconUrl: 'https://media.beincom.app/image/variants/badge/cd3ce7ed-510a-4b3e-9a7e-c0725fad3d9f',
          community: {
            id: '8e6b39d2-5bc0-4a82-bf81-f90509080c47',
            name: 'BA_tuyet2',
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
      importantExpiredAt: '2023-06-01T07:27:37.686Z',
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
