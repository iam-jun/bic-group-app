import { COMMUNITY_ROLE } from '../../interfaces/ICommunity';

export const communities = [
  {
    id: 0,
    groupId: 0,
    name: 'string',
    slug: 'string',
    privacy: 'PUBLIC',
    description: 'string',
    icon: 'string',
    backgroundImgUrl: 'string',
    teamId: 'string',
    members: [
      {
        id: 0,
        chatUserId: 'string',
        email: 'string',
        username: 'string',
        fullname: 'string',
        gender: 'MALE',
        birthday: '2022-04-26T08:29:58.579Z',
        avatar:
          'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
        backgroundImgUrl:
          'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
        phone: 'string',
        address: 'string',
        language: ['string'],
        description: 'string',
        relationshipStatus: null,
      },
    ],
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 0,
    joinStatus: 0,
  },
];

export const communityDetailData = {
  id: '1',
  groupId: '1',
  name: 'EVOL Community',
  slug: 'evol',
  privacy: 'PUBLIC',
  description: 'Description',
  icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
  backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
  teamId: 'string',
  createdAt: '2022-04-26T08:29:58.579Z',
  updatedAt: '2022-04-26T08:29:58.579Z',
  userCount: 5,
  joinStatus: 2,
};

export const previewMemberDetail = {
  id: '1',
  username: 'test',
  fullname: 'Test Name',
  avatar:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e41d70bc-0bfd-4c56-a461-c2dfb10434c1.jpg',
};

export const adminDetail = {
  ...previewMemberDetail,
  roles: { name: 'COMMUNITY_ADMIN' as COMMUNITY_ROLE },
  chatUserId: 'tg6kmc6cmybgwpcif9znngyyebe',
};

export const memberDetail = {
  ...previewMemberDetail,
  roles: { name: 'MEMBER' as COMMUNITY_ROLE },
  chatUserId: 'tg6kmc6cmybgwpcif9znngyyebe',
};

export const previewMemberData = [
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
  previewMemberDetail,
];

export const memberData = {
  community_admin: {
    data: [adminDetail, adminDetail, adminDetail, adminDetail, adminDetail],
    userCount: 5,
    name: 'COMMUNITY_ADMIN',
  },
  community_member: {
    data: [
      memberDetail,
      memberDetail,
      memberDetail,
      memberDetail,
      memberDetail,
      memberDetail,
    ],
    userCount: 6,
    name: 'COMMUNITY_MEMBER',
  },
};

export const memberRequestDetail = {
  id: '26',
  userId: '16',
  createdAt: '2022-05-21T08:09:22.320Z',
  updatedAt: '2022-06-06T08:12:53.483Z',
  groupId: '2',
  status: 'waiting',
  user: {
    id: '16',
    username: 'usernametest',
    fullname: 'User Name Test',
    avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/949ad541-c16f-4974-a83c-db04f3a393c9.jpg',
    country: 'Việt Nam',
    city: 'Hồ Chí Minh',
    email: 'usernametest@mail.com',
    phone: null,
    countryCode: null,
    latestWork: null,
  },
};

export const listDiscoverCommunities = [
  {
    id: '1',
    groupId: '1',
    name: 'EVOL Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
    joinStatus: 2,
  },
  {
    id: '2',
    groupId: '1',
    name: 'Dog Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
    joinStatus: 2,
  },
  {
    id: '3',
    groupId: '1',
    name: 'Pig Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
    joinStatus: 2,
  },
  {
    id: '4',
    groupId: '1',
    name: 'Cat Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
    joinStatus: 2,
  },
  {
    id: '5',
    groupId: '1',
    name: 'Chicken Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
    joinStatus: 2,
  },

];

export const listYourCommunities = [
  {
    id: '1',
    groupId: '1',
    name: 'EVOL Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
  },
  {
    id: '2',
    groupId: '1',
    name: 'Dog Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
  },
  {
    id: '3',
    groupId: '1',
    name: 'Pig Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
  },
  {
    id: '4',
    groupId: '1',
    name: 'Cat Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
  },
  {
    id: '5',
    groupId: '1',
    name: 'Chicken Community',
    slug: 'evol',
    privacy: 'PUBLIC',
    description: 'Description',
    icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
    backgroundImgUrl:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    teamId: 'string',
    createdAt: '2022-04-26T08:29:58.579Z',
    updatedAt: '2022-04-26T08:29:58.579Z',
    userCount: 5,
  },

];

export const listYourGroups = [
  {
    id: 'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d',
    name: 'Bein Community',
    icon: null,
    level: 1,
    parents: [
      '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    ],
    privacy: 'PUBLIC',
    description: null,
    backcgroundImgUrl: null,
    userCount: 22,
    community: {
      id: '15337361-1577-4b7b-a31d-990df06aa446',
      name: 'EVOL Community',
      groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    },
  },
  {
    id: '928d15c3-8225-4197-8189-63907f17093d',
    name: 'Crypto Inner Circle',
    icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
    level: 1,
    parents: [
      '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    ],
    privacy: 'PUBLIC',
    description: 'https://fe.sbx.beincomm.com/groups/2',
    backgroundImgUrl: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/cover/images/original/072b78ab-25d3-462f-b5d7-43644d9b9f80',
    userCount: 30,
    community: {
      id: '15337361-1577-4b7b-a31d-990df06aa446',
      name: 'EVOL Community',
      groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    },
  },
];

export const listOwnCommunity = [
  {
    id: '88b95fe1-be57-4bb8-b414-30737db1052b',
    groupId: '98d4f395-05f0-488e-b38d-371dbb8a89a7',
    name: 'Hội những ng thích nhạc bolero',
    privacy: 'PUBLIC',
    slug: '186f8c8a2460',
    description: 'ahihi',
    icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
    backgroundImgUrl: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
    userCount: 1,
  },
];

export const listManage = [
  {
    id: '2b15df32-ac56-47d8-ac63-aaa2dd199d00',
    name: 'Community của Tèo',
    icon: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
    level: 0,
    parents: [],
    privacy: 'PUBLIC',
    slug: '72880b4b1e35',
    description: '123. Tuy nhiên, trong cuộc họp báo sau trận đấu Philippines, HLV Park khẳng định: Kết quả giữa Malaysia và Thái Lan chẳng liên quan tới trận đấu của Việt Nam. Tôi cũng không tính toán gì từ trận đấu đó',
    backgroundImgUrl: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
    userCount: 11,
    community: {
      id: 'e32a2676-0fbe-4900-a00d-e2825329b24e',
      name: 'Community của Tèo',
      groupId: '2b15df32-ac56-47d8-ac63-aaa2dd199d00',
    },
  },
  {
    id: 'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d',
    name: 'Bein Community',
    icon: null,
    level: 1,
    parents: [
      '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    ],
    privacy: 'PUBLIC',
    slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
    description: null,
    backgroundImgUrl: null,
    userCount: 22,
    community: {
      id: '15337361-1577-4b7b-a31d-990df06aa446',
      name: 'EVOL Community',
      groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    },
  },
  {
    id: '928d15c3-8225-4197-8189-63907f17093d',
    name: 'Crypto Inner Circle',
    icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
    level: 1,
    parents: [
      '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    ],
    privacy: 'PUBLIC',
    slug: 'crypto-inner-circle-1641809088',
    description: 'https://fe.sbx.beincomm.com/groups/2',
    backgroundImgUrl: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/cover/images/original/072b78ab-25d3-462f-b5d7-43644d9b9f80',
    userCount: 30,
    community: {
      id: '15337361-1577-4b7b-a31d-990df06aa446',
      name: 'EVOL Community',
      groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    },
  },
];
