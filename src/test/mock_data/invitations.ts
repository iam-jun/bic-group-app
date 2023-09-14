import APIErrorCode from '~/constants/apiErrorCode';

export const mockResposeSuccess = {
  code: 'api.ok',
  meta: { message: 'Accept invitation successfully' },
};

export const mockResposeErrorAlreadyAccepted = {
  code: APIErrorCode.Group.INVITATION_IS_ALREADY_SENT_ACCEPTED,
  data: null,
  meta: {
    message: 'This invitation is accepted',
    errors: null,
    cause: {
      name: 'InvitationUpdateStatusException',
      message: 'This invitation is accepted',
    },
  },
};

export const mockResposeErrorAlreadyDeclined = {
  code: APIErrorCode.Group.INVITATION_IS_ALREADY_SENT_DECLINED,
  data: null,
  meta: {
    message: 'This invitation is declined',
    errors: null,
    cause: {
      name: 'InvitationUpdateStatusException',
      message: 'This invitation is declined',
    },
  },
};

export const mockResposeErrorAlreadyCancelled = {
  code: APIErrorCode.Group.INVITATION_IS_ALREADY_CANCELLED,
  data: null,
  meta: {
    message: 'This invitation is cancled',
    errors: null,
    cause: {
      name: 'InvitationUpdateStatusException',
      message: 'This invitation is cancled',
    },
  },
};

export const mockResposeListInvitation = {
  code: 'api.ok',
  data: [
    {
      id: '864e8d9c-aea3-4d54-bc40-337fd904eb88',
      communityId: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
      inviter: {
        id: '5b2939a5-302c-4332-af78-663083e97c6d',
        username: 'trankimmai',
        fullname: 'Mai',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/733f835e-3766-4558-9e5d-4849f04091b5',
        isDeactivated: false,
      },
      invitee: {
        id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
        username: 'thuquyen',
        fullname: 'Thu Quyền',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
        isDeactivated: false,
      },
      targetType: 'GROUP',
      targetInfo: {
        id: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
        name: 'Khamsamita',
        isRootGroup: false,
      },
      status: 'WAITING',
      createdAt: '2023-08-13T07:04:12.459Z',
      updatedAt: '2023-08-13T07:04:12.459Z',
    },
    {
      id: 'e82bd96f-2f2b-4291-b42a-7066b83322e4',
      communityId: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
      inviter: {
        id: '5b2939a5-302c-4332-af78-663083e97c6d',
        username: 'trankimmai',
        fullname: 'Mai',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/733f835e-3766-4558-9e5d-4849f04091b5',
        isDeactivated: false,
      },
      invitee: {
        id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
        username: 'thuquyen',
        fullname: 'Thu Quyền',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
        isDeactivated: false,
      },
      targetType: 'GROUP',
      targetInfo: {
        id: '879c8129-0840-437f-8f23-a7585dc6ba22',
        name: 'Discover group của Mai',
        isRootGroup: true,
      },
      status: 'WAITING',
      createdAt: '2023-08-12T04:19:38.610Z',
      updatedAt: '2023-08-12T04:19:38.610Z',
    },
    {
      id: '408683d0-7f21-45a5-a8f5-385dc178b564',
      inviter: {
        id: '3d08dcbd-d149-46c1-ba65-7a6861d94518',
        username: 'vuthilieu',
        fullname: 'Vũ Thị Liễu',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/12d1d40f-4183-4ffd-bae0-de024154420d',
        isDeactivated: false,
      },
      invitee: {
        id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
        username: 'thuquyen',
        fullname: 'Thu Quyền',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
        isDeactivated: false,
      },
      targetType: 'GROUP',
      targetInfo: {
        id: '2c811d71-8159-4c67-84a9-8fcb1ce5cf8e',
        name: 'Community cho các bạn mới',
      },
      status: 'WAITING',
      createdAt: '2023-08-12T04:18:45.199Z',
      updatedAt: '2023-08-12T04:18:45.199Z',
    },
    {
      id: '72118f88-ca37-45c1-98c7-c0b51306b1a8',
      inviter: {
        id: '3d08dcbd-d149-46c1-ba65-7a6861d94518',
        username: 'vuthilieu',
        fullname: 'Vũ Thị Liễu',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/12d1d40f-4183-4ffd-bae0-de024154420d',
        isDeactivated: false,
      },
      invitee: {
        id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
        username: 'thuquyen',
        fullname: 'Thu Quyền',
        avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
        isDeactivated: false,
      },
      targetType: 'GROUP',
      targetInfo: {
        id: 'e46ab545-923d-437c-b62e-6352a57e0737',
        name: 'Private Com LU',
      },
      status: 'WAITING',
      createdAt: '2023-08-12T03:30:15.727Z',
      updatedAt: '2023-08-12T03:30:15.727Z',
    },
  ],
  meta: {
    hasNextPage: false,
  },
};

export const mockGroupedInvitations = [
  {
    id: 1,
    title: 'Thg 08 13, 2023',
    data: ['864e8d9c-aea3-4d54-bc40-337fd904eb88'],
  },
  {
    id: 2,
    title: 'Thg 08 12, 2023',
    data: [
      'e82bd96f-2f2b-4291-b42a-7066b83322e4',
      '408683d0-7f21-45a5-a8f5-385dc178b564',
      '72118f88-ca37-45c1-98c7-c0b51306b1a8',
    ],
  },
];

export const mockInvitationData = {
  '864e8d9c-aea3-4d54-bc40-337fd904eb88': {
    id: '864e8d9c-aea3-4d54-bc40-337fd904eb88',
    communityId: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
    inviter: {
      id: '5b2939a5-302c-4332-af78-663083e97c6d',
      username: 'trankimmai',
      fullname: 'Mai',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/733f835e-3766-4558-9e5d-4849f04091b5',
      isDeactivated: false,
    },
    invitee: {
      id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
      username: 'thuquyen',
      fullname: 'Thu Quyền',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
      isDeactivated: false,
    },
    targetType: 'GROUP',
    targetInfo: {
      id: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
      name: 'Khamsamita',
      isRootGroup: false,
    },
    status: 'WAITING',
    createdAt: '2023-08-13T07:04:12.459Z',
    updatedAt: '2023-08-13T07:04:12.459Z',
  },
  'e82bd96f-2f2b-4291-b42a-7066b83322e4': {
    id: 'e82bd96f-2f2b-4291-b42a-7066b83322e4',
    communityId: '305abca0-2f14-4fac-91d6-9bf8074c93b9',
    inviter: {
      id: '5b2939a5-302c-4332-af78-663083e97c6d',
      username: 'trankimmai',
      fullname: 'Mai',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/733f835e-3766-4558-9e5d-4849f04091b5',
      isDeactivated: false,
    },
    invitee: {
      id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
      username: 'thuquyen',
      fullname: 'Thu Quyền',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
      isDeactivated: false,
    },
    targetType: 'GROUP',
    targetInfo: {
      id: '879c8129-0840-437f-8f23-a7585dc6ba22',
      name: 'Discover group của Mai',
      isRootGroup: true,
    },
    status: 'WAITING',
    createdAt: '2023-08-12T04:19:38.610Z',
    updatedAt: '2023-08-12T04:19:38.610Z',
  },
  '408683d0-7f21-45a5-a8f5-385dc178b564': {
    id: '408683d0-7f21-45a5-a8f5-385dc178b564',
    inviter: {
      id: '3d08dcbd-d149-46c1-ba65-7a6861d94518',
      username: 'vuthilieu',
      fullname: 'Vũ Thị Liễu',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/12d1d40f-4183-4ffd-bae0-de024154420d',
      isDeactivated: false,
    },
    invitee: {
      id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
      username: 'thuquyen',
      fullname: 'Thu Quyền',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
      isDeactivated: false,
    },
    targetType: 'GROUP',
    targetInfo: {
      id: '2c811d71-8159-4c67-84a9-8fcb1ce5cf8e',
      name: 'Community cho các bạn mới',
    },
    status: 'WAITING',
    createdAt: '2023-08-12T04:18:45.199Z',
    updatedAt: '2023-08-12T04:18:45.199Z',
  },
  '72118f88-ca37-45c1-98c7-c0b51306b1a8': {
    id: '72118f88-ca37-45c1-98c7-c0b51306b1a8',
    inviter: {
      id: '3d08dcbd-d149-46c1-ba65-7a6861d94518',
      username: 'vuthilieu',
      fullname: 'Vũ Thị Liễu',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/12d1d40f-4183-4ffd-bae0-de024154420d',
      isDeactivated: false,
    },
    invitee: {
      id: '0d95b21a-1ee4-43e2-9b95-ae4968f9bff6',
      username: 'thuquyen',
      fullname: 'Thu Quyền',
      avatar: 'https://media.beincom.app/image/variants/user/avatar/bc0a24b1-a91b-4923-9224-263cbc1b31b2',
      isDeactivated: false,
    },
    targetType: 'GROUP',
    targetInfo: {
      id: 'e46ab545-923d-437c-b62e-6352a57e0737',
      name: 'Private Com LU',
    },
    status: 'WAITING',
    createdAt: '2023-08-12T03:30:15.727Z',
    updatedAt: '2023-08-12T03:30:15.727Z',
  },
};
