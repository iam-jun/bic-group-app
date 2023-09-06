import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { IParamsAcceptSingleInvitation } from '~/interfaces/IGroup';

const acceptSingleInvitation = (_set, _get) => async (params: IParamsAcceptSingleInvitation) => {
  try {
    const { invitationId, callback } = params;
    const response = await groupApi.acceptInvitation(invitationId);

    showToastSuccess(response);
    callback();
  } catch (err) {
    console.error('\x1b[33m', 'acceptSingleInvitation error', err, '\x1b[0m');
    showToastError(err);
  }
};

export default acceptSingleInvitation;
