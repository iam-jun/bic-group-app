import {COMMUNITY_ROLE} from '~/interfaces/ICommunity';
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
    ownerId: 0,
    userCount: 0,
    joinStatus: 0,
  },
];

export const discoverCommunity = {
  id: 1,
  group_id: 1,
  name: 'Cộng đồng khám phá',
  slug: '27505c',
  privacy: 'PRIVATE',
  description: 'Mô tả về cộng đồng nè',
  icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/32fc59a2-7361-4313-b5a3-d4eb4a5712af.jpg',
  background_img_url:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/cover/images/original/f3a578ea-7382-4b34-94ff-700a818026f5.jpg',
  user_count: 7,
  join_status: 1,
};

export const communityDetailData = {
  id: 1,
  group_id: 1,
  name: 'EVOL Community',
  slug: 'evol',
  privacy: 'PUBLIC',
  description: 'Description',
  icon: 'https://img.flaticon.com/icons/png/512/86/86494.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
  background_img_url:
    'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
  teamId: 'string',
  created_at: '2022-04-26T08:29:58.579Z',
  updated_at: '2022-04-26T08:29:58.579Z',
  user_count: 5,
  can_setting: true,
  can_manage_member: true,
  can_leave: true,
  join_status: 2,
};

export const previewMemberDetail = {
  id: 1,
  username: 'test',
  fullname: 'Test Name',
  avatar:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/e41d70bc-0bfd-4c56-a461-c2dfb10434c1.jpg',
};

export const adminDetail = {
  ...previewMemberDetail,
  roles: {name: 'COMMUNITY_ADMIN' as COMMUNITY_ROLE},
  chat_user_id: 'tg6kmc6cmybgwpcif9znngyyebe',
};

export const memberDetail = {
  ...previewMemberDetail,
  roles: {name: 'MEMBER' as COMMUNITY_ROLE},
  chat_user_id: 'tg6kmc6cmybgwpcif9znngyyebe',
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
    user_count: 5,
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
    user_count: 6,
    name: 'MEMBER',
  },
};
