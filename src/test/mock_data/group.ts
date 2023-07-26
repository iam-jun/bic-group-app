import { GroupPrivacyType } from '~/constants/privacyTypes';
import { IGroupDetail } from '~/interfaces/IGroup';
import { POST_DETAIL } from './post';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

export const groupDetailData: IGroupDetail = {
  group: {
    id: '0f5c4bb8-323b-41ee-8aed-b064fecf492b',
    parentId: undefined,
    name: 'EVOL Community',
    slug: 'evol-community-1641809088',
    description: 'The greatest community ever',
    level: 1,
    parents: [
      '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
    ],
    icon: '',
    backgroundImgUrl: null,
    privacy: GroupPrivacyType.OPEN,
    chatId: 'rpq3unai7i8ztprmoz97rdjr7w',
    createdAt: '2022-01-10T10:04:48.685Z',
    updatedAt: '2022-01-10T10:04:48.928Z',
    deletedAt: null,
    userCount: 25,
  },
  joinStatus: GroupJoinStatus.MEMBER,
};

export const adminDetail = {
  id: '1',
  username: 'testmember',
  fullname: 'Test Name Admin',
  avatar:
    'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
  chatUserId: 'mdp9rococ3d83qk9nbrybxay3e',
  isAdmin: true,
  customRoleIds: [],
  roles: [
    {
      dataValues: {
        id: '23a07c64-27d7-4438-a17d-9aae7bbbd4df',
        name: 'Admin',
        type: 'GROUP_ADMIN',
        permissions: [
          'view_group_profile',
          'view_group_members',
          'view_message',
          'view_message_history',
          'send_message',
          'send_files',
          'send_images',
          'react',
          'send_tickers',
          'mention_all_here',
          'pin_message',
          'view_post',
          'view_post_statistic',
          'create_post',
          'view_related_post',
          'report_member',
          'manage_member',
          'setting',
          'approve_post',
          'report_post',
          'mark_important_post',
          'delete_post',
          'edit_group_profile',
          'change_parent_group',
          'delete_message',
        ],
      },
      previousDataValues: {
        id: '23a07c64-27d7-4438-a17d-9aae7bbbd4df',
        name: 'Admin',
        type: 'GROUP_ADMIN',
        permissions: [
          'view_group_profile',
          'view_group_members',
          'view_message',
          'view_message_history',
          'send_message',
          'send_files',
          'send_images',
          'react',
          'send_tickers',
          'mention_all_here',
          'pin_message',
          'view_post',
          'view_post_statistic',
          'create_post',
          'view_related_post',
          'report_member',
          'manage_member',
          'setting',
          'approve_post',
          'report_post',
          'mark_important_post',
          'delete_post',
          'edit_group_profile',
          'change_parent_group',
          'delete_message',
        ],
      },
      changed: {},
      options: {
        isNewRecord: false,
        schema: 'bein',
        schemaDelimiter: '',
        includeValidated: true,
        raw: true,
        attributes: ['id', 'name', 'type', 'permissions'],
      },
      isNewRecord: false,
    },
  ],
};

export const memberDetail = {
  id: '2',
  username: 'testmember',
  fullname: 'Test Name Member',
  avatar:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
  chatUserId: '4bkzernmdtgb7eiy9yspw3n4ra',
  isAdmin: false,
  customRoleIds: [],
  roles: [],
};

export const memberData = {
  groupAdmin: {
    name: 'Admin',
    data: [adminDetail, adminDetail, adminDetail],
    userCount: 3,
  },
  groupMember: {
    name: 'Member',
    data: [memberDetail, memberDetail, memberDetail, memberDetail],
    userCount: 4,
  },
};

export const discoverGroup = {
  id: '24',
  parentId: '22',
  name: 'Bein Back-end Bein Group',
  slug: '504bb9ec-3e69-472a-8d2d-74cbbac75ca9-1641835590',
  description: null,
  level: 4,
  createdBy: '1',
  icon: null,
  backgroundImgUrl: null,
  privacy: GroupPrivacyType.OPEN,
  chatId: 'aj1s4cktxjg53npisjetdspyxy',
  schemeId: 'd9e5362a-ca6b-42c7-8530-a3b2aa67f15a',
  createdAt: '2022-01-10T17:26:29.895Z',
  updatedAt: '2022-01-10T17:47:44.883Z',
  deletedAt: null,
  userCount: 7,
  joinStatus: GroupJoinStatus.VISITOR,
};

/**
 * Selecting status:
 * [ ] EVOL Community
 *  - [x] Bein Community
 *  -  - [x] Bein Product Team
 */
export const GROUP_TREE_WITH_SELECTING = {
  1: false,
  10: {
    id: '10',
    parentId: '1',
    name: 'Bein Community',
    slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
    description: null,
    level: 1,
    parents: [1],
    icon: null,
    backgroundImgUrl: null,
    privacy: GroupPrivacyType.OPEN,
    chatId: 'nc1m1i78fpdaiktp7bdzdnntgh',
    createdAt: '2022-01-10T17:15:08.123Z',
    updatedAt: '2022-01-10T17:15:08.592Z',
    deletedAt: null,
    children: [],
    userCount: '19',
    uiId: 'tree_0_0',
    parentUiId: 'tree_0',
    hide: false,
    uiLevel: 1,
    isCollapsing: false,
    isChecked: true,
    childrenUiIds: ['tree_0_0_0'],
  },
  17: {
    id: '17',
    parentId: '10',
    name: 'Bein Product Team',
    slug: 'cd99ab19-a7bf-461b-9b0e-35f809774821-1641835298',
    description: null,
    level: 2,
    parents: ['1', '10'],
    icon: null,
    backgroundImgUrl: null,
    privacy: GroupPrivacyType.OPEN,
    chatId: '3typp5m3b3r7byuu5q3fjqmaaa',
    createdAt: '2022-01-10T17:21:38.026Z',
    updatedAt: '2022-01-10T17:47:03.538Z',
    deletedAt: null,
    children: [],
    userCount: '18',
    uiId: 'tree_0_0_0',
    parentUiId: 'tree_0_0',
    hide: false,
    uiLevel: 2,
    isCollapsing: false,
    isChecked: true,
    childrenUiIds: [],
  },
};

/**
 * Mock data of tree
 *  - EVOL Community
 *  - - Bein Community
 *  - - - Bein Product Team
 */
export const GROUP_TREE = {
  id: '1',
  parentId: null,
  name: 'EVOL Community',
  slug: 'evol-community-1641809088',
  description: 'The greatest community ever',
  level: 0,
  parents: null,
  icon: '',
  backgroundImgUrl: null,
  privacy: GroupPrivacyType.OPEN,
  chatId: 'rpq3unai7i8ztprmoz97rdjr7w',
  createdAt: '2022-01-10T10:04:48.685Z',
  updatedAt: '2022-01-10T10:04:48.928Z',
  deletedAt: null,
  children: [
    {
      id: '10',
      parentId: '1',
      name: 'Bein Community',
      slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
      description: null,
      level: 1,
      parents: ['1'],
      icon: null,
      backgroundImgUrl: null,
      privacy: GroupPrivacyType.OPEN,
      chatId: 'nc1m1i78fpdaiktp7bdzdnntgh',
      createdAt: '2022-01-10T17:15:08.123Z',
      updatedAt: '2022-01-10T17:15:08.592Z',
      deletedAt: null,
      children: [
        {
          id: '17',
          parentId: '10',
          name: 'Bein Product Team',
          slug: 'cd99ab19-a7bf-461b-9b0e-35f809774821-1641835298',
          description: null,
          level: 2,
          parents: ['1', '10'],
          icon: null,
          backgroundImgUrl: null,
          privacy: GroupPrivacyType.OPEN,
          chatId: '3typp5m3b3r7byuu5q3fjqmaaa',
          createdAt: '2022-01-10T17:21:38.026Z',
          updatedAt: '2022-01-10T17:47:03.538Z',
          deletedAt: null,
          children: [],
          userCount: '18',
        },
      ],
      userCount: '19',
    },
  ],
  userCount: '25',
  unique: 'ad26adcf-2827-42e2-9f3e-19ae2192b6d0',
};

// contains 25 (appConfig.recordsPerPage) data for testing
export const groupPostData = [
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
  POST_DETAIL,
];

export const GROUP_ASSIGNMENTS = {
  groupId: '1',
  schemeId: 'efgh',
  name: 'Town Square',
  level: 0,
  privacy: GroupPrivacyType.OPEN,
  icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/e55a5e2f-5f61-4a1b-ad3f-623f08eec1a1',
  description: 'The greatest community ever yeahhhhhhhhhh 123',
  children: [
    {
      groupId: '2',
      schemeId: null,
      name: 'Crypto Inner Circle',
      level: 1,
      privacy: GroupPrivacyType.OPEN,
      icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
      description: 'https://fe.sbx.beincomm.com/groups/2',
    },
  ],
};

export const MEMBERSHIP_QUESITONS = [
  {
    id: 'string 1',
    groupId: ' 1',
    question: '1. What is the cross with the loop at the top?',
    isRequired: true,
    createdAt: 'string',
    updatedAt: 'string',
  },
  {
    id: 'string 2',
    groupId: ' 1',
    question: '2. What is the best courses to do after MBA marketing? What is the best courses to do after MBA marketing? What is the best courses to do after MBA marketing? What is the best courses to do after MBA marketing?',
    isRequired: false,
    createdAt: 'string',
    updatedAt: 'string',
  },
  {
    id: 'string 3',
    groupId: ' 1',
    question: '3. What is the cross with the loop at the top?',
    isRequired: false,
    createdAt: 'string',
    updatedAt: 'string',
  },
  {
    id: 'string 4',
    groupId: ' 1',
    question: '4. What is the cross with the loop at the top?',
    isRequired: false,
    createdAt: 'string',
    updatedAt: 'string',
  }, {
    id: 'string 5',
    groupId: ' 1',
    question: '5. What is the cross with the loop at the top?',
    isRequired: false,
    createdAt: 'string',
    updatedAt: 'string',
  },
];

export const getPreviewJoinableGroupResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
  },
  data: {
    id: 'c5942e30-8a90-4f66-9683-e17166281213',
    slug: '68a253a43ec0',
    level: 0,
    chat_group_id: 'NEW_CHANNEL',
    is_archived: false,
    children: [
      {
        id: '436d3455-d336-4c14-90d6-e49095d46841',
        slug: 'g-lv-1',
        level: 1,
        chat_group_id: 'NEW_CHANNEL',
        is_archived: false,
        children: [
          {
            id: '2fca448c-4d61-4e5b-8907-ccb817fe89d0',
            slug: 'g-lv-2',
            level: 2,
            chat_group_id: 'NEW_CHANNEL',
            is_archived: false,
            children: [
              {
                id: '7ed6a98d-45a1-4842-b765-d0b3d2aefb35',
                slug: 'g-lv-3',
                level: 3,
                chat_group_id: 'NEW_CHANNEL',
                is_archived: false,
                children: [],
                name: 'back-end',
                description: null,
                settings: {
                  is_invited_only: false,
                  is_join_approval: true,
                },
                affected_settings: {
                  is_invited_only: false,
                  is_join_approval: true,
                },
                parent_id: '2fca448c-4d61-4e5b-8907-ccb817fe89d0',
                parents: [
                  'c5942e30-8a90-4f66-9683-e17166281213',
                  '436d3455-d336-4c14-90d6-e49095d46841',
                  '2fca448c-4d61-4e5b-8907-ccb817fe89d0',
                ],
                privacy: 'CLOSED',
                chat_id: 'unknown',
                background_img_url:
                  'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
                icon: 'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                scheme_id: 'a8f44254-66b3-4890-8166-e6ffec9ca7eb',
                created_by: '16063299-e91e-4a31-a948-422fe57ad470',
                community_id: '68a2e004-34f4-4039-ad2f-676ac17336de',
                created_at: '2023-06-27T02:59:32.878Z',
                updated_at: '2023-07-07T02:56:03.463Z',
                deleted_at: null,
              },
            ],
            name: 'g lv 2',
            description: null,
            settings: {
              is_join_approval: true,
            },
            affected_settings: {
              is_join_approval: true,
            },
            parent_id: '436d3455-d336-4c14-90d6-e49095d46841',
            parents: ['c5942e30-8a90-4f66-9683-e17166281213', '436d3455-d336-4c14-90d6-e49095d46841'],
            privacy: 'PRIVATE',
            chat_id: 'unknown',
            background_img_url:
              'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
            icon: 'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
            scheme_id: 'a8f44254-66b3-4890-8166-e6ffec9ca7eb',
            created_by: '16063299-e91e-4a31-a948-422fe57ad470',
            community_id: '68a2e004-34f4-4039-ad2f-676ac17336de',
            created_at: '2023-06-27T02:59:24.325Z',
            updated_at: '2023-07-03T17:25:30.687Z',
            deleted_at: null,
          },
        ],
        name: 'g lv 1',
        description: null,
        settings: {
          is_join_approval: true,
        },
        affected_settings: {
          is_join_approval: true,
        },
        parent_id: 'c5942e30-8a90-4f66-9683-e17166281213',
        parents: ['c5942e30-8a90-4f66-9683-e17166281213'],
        privacy: 'PRIVATE',
        chat_id: 'unknown',
        background_img_url:
          'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
        icon: 'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        scheme_id: 'a8f44254-66b3-4890-8166-e6ffec9ca7eb',
        created_by: '16063299-e91e-4a31-a948-422fe57ad470',
        community_id: '68a2e004-34f4-4039-ad2f-676ac17336de',
        created_at: '2023-06-27T02:58:33.716Z',
        updated_at: '2023-07-03T17:25:30.687Z',
        deleted_at: null,
      },
    ],
    name: 'trang Lake Dashawnfort',
    description: 'OPEN',
    settings: {
      is_join_approval: false,
    },
    affected_settings: {
      is_join_approval: false,
      is_active_membership_questions: false,
    },
    parents: [],
    privacy: 'OPEN',
    chat_id: 'unknown',
    background_img_url:
      'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
    icon: 'https://bic-itn-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
    scheme_id: 'a8f44254-66b3-4890-8166-e6ffec9ca7eb',
    created_by: '16063299-e91e-4a31-a948-422fe57ad470',
    community_id: '68a2e004-34f4-4039-ad2f-676ac17336de',
    created_at: '2023-06-27T02:57:55.532Z',
    updated_at: '2023-07-03T17:25:30.687Z',
    deleted_at: null,
  },
};

export const previewSettingsResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
  },
  data: {
    affectedInnerGroups: [
      {
        name: 'Bot trading',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
        description: 'Bot trading',
      },
      {
        name: '.NET private group 3',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
        description: '.NET private group3',
      },
      {
        name: 'Software Engineering',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/58372eb7-249e-43ae-be01-25ffdadf18e3.jpg',
        description: 'Software Engineering',
      },
      {
        name: 'Dota 3',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
        description: 'add description',
      },
      {
        name: 'test',
        icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
        description: null,
      },
    ],
  },
};

export const getSettingsResponse = {
  code: 'api.ok',
  meta: { message: 'Success' },
  data: {
    settings: { isInvited_only: false, isJoin_approval: false },
    changeableSettings: {
      isJoinApproval: '',
      isInvitedOnly: '',
      isActiveGroupTerms: '',
      isActiveMembershipQuestions: '',
    },
  },
};

export const previewPrivacyResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
  },
  data: {
    affectedInnerGroupsMembershipApproval: [
      {
        id: '1',
        name: 'test',
      },
    ],
    badge: null,
  },
};
