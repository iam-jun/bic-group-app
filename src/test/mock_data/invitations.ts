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
