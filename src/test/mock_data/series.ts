export const mockSeries = {
  owner_reactions: [],
  id: '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8',
  lang: null,
  title: 'series 111',
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
  reactionsCount: {},
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
  },
  {
    id: '2',
    title: 'Be The First Line List Series.',
  },
  {
    id: '3',
    title: 'Be The First Line List Series.',
  },
];

export const article = {
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
