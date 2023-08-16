import { IInvitationsStatus, InvitationsTargetType } from '~/interfaces/IGroup';

export const responseGetInvitations = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 2,
    offset: 0,
    limit: 25,
    has_next_page: false,
  },
  data: [
    {
      id: 'b3f7ba01-ee71-4ef8-ae26-b9d32e6b9685',
      inviter: {
        id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
        username: 'trannamanh',
        fullname: 'Nam Anh',
        avatar: 'https://media.beincom.io/image/variants/user/avatar/1e65c01e-7916-46aa-b5a8-aeea19cfef97',
        isDeactivated: false,
      },
      invitee: {
        id: '558f73eb-c25d-4d04-94ad-533f9eb3afee',
        username: 'bigguyyy',
        fullname: 'Cao Tri Thanh',
        avatar: 'https://media.beincom.io/image/variants/user/avatar/283a8a13-8034-437e-bc7f-56c845a3c7e9',
        isDeactivated: false,
      },
      targetType: InvitationsTargetType.GROUP,
      targetInfo: {
        id: '08bac944-5016-4f56-a744-3fc0c438b23b',
        name: "Community's Phát",
      },
      status: IInvitationsStatus.WAITING,
      createdAt: '2023-08-10T10:54:41.057Z',
      updatedAt: '2023-08-10T10:54:41.057Z',
    },
    {
      id: 'b3f7ba01-ee71-4ef8-ae26-b9d32e6b9685',
      inviter: {
        id: '7b63852c-5249-499a-a32b-6bdaa2761fc2',
        username: 'trannamanh',
        fullname: 'Nam Anh',
        avatar: 'https://media.beincom.io/image/variants/user/avatar/1e65c01e-7916-46aa-b5a8-aeea19cfef97',
        isDeactivated: false,
      },
      invitee: {
        id: '558f73eb-c25d-4d04-94ad-533f9eb3afee',
        username: 'bigguyyy',
        fullname: 'Cao Tri Thanh',
        avatar: 'https://media.beincom.io/image/variants/user/avatar/283a8a13-8034-437e-bc7f-56c845a3c7e9',
        isDeactivated: false,
      },
      targetType: InvitationsTargetType.GROUP,
      targetInfo: {
        id: '08bac944-5016-4f56-a744-3fc0c438b23b',
        name: "Community's Phát",
      },
      status: IInvitationsStatus.WAITING,
      createdAt: '2023-08-10T10:54:41.057Z',
      updatedAt: '2023-08-10T10:54:41.057Z',
    },
  ],
};

export const responseCancelInvitation = { code: 'api.ok', meta: { message: 'Cancel invitation successfully' } };

export const responseAcceptSingleInvitation = {
  code: 'invitation.status.accepted',
  data: null,
  meta: {
    message: 'This invitation was already accepted',
    errors: null,
    cause: {
      name: 'InvitationUpdateStatusException',
      message: 'This invitation was already accepted',
    },
  },
};

export const responseDeclineSingleInvitation = { code: 'api.ok', meta: { message: 'Decline invitation successfully' } };
