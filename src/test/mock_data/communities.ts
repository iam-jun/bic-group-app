import { COMMUNITY_ROLE } from '~/interfaces/ICommunity';

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
  roles: { name: 'COMMUNITY_ADMIN' as COMMUNITY_ROLE },
  chat_user_id: 'tg6kmc6cmybgwpcif9znngyyebe',
};

export const memberDetail = {
  ...previewMemberDetail,
  roles: { name: 'MEMBER' as COMMUNITY_ROLE },
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
    name: 'COMMUNITY_MEMBER',
  },
};

export const memberRequestDetail = {
  id: 26,
  user_id: 16,
  created_at: '2022-05-21T08:09:22.320Z',
  updated_at: '2022-06-06T08:12:53.483Z',
  group_id: 2,
  status: 'waiting',
  user: {
    id: 16,
    username: 'usernametest',
    fullname: 'User Name Test',
    avatar:
      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/949ad541-c16f-4974-a83c-db04f3a393c9.jpg',
    country: 'Việt Nam',
    city: 'Hồ Chí Minh',
    email: 'usernametest@mail.com',
    phone: null,
    country_code: null,
    latest_work: null,
  },
};
