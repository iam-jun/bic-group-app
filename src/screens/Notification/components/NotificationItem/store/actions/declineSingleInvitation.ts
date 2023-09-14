import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { IParamsDeclineSingleInvitation } from '~/interfaces/IGroup';

const declineSingleInvitation = (_set, _get) => async (params: IParamsDeclineSingleInvitation) => {
  try {
    const { invitationId, callback } = params;
    const response = await groupApi.declineInvitation(invitationId);

    showToastSuccess(response);
    callback();
  } catch (err) {
    console.error('\x1b[33m', 'declineSingleInvitation error', err, '\x1b[0m');
    showToastError(err);
  }
};

export default declineSingleInvitation;
