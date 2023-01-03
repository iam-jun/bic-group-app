import GroupApi from '~/api/GroupApi';
import { IPayloadReportMember } from '~/interfaces/IReport';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const reportMember = () => async (payload: IPayloadReportMember) => {
  const { targetId: userId, communityId, reason } = payload || {};

  try {
    const response = await GroupApi.reportMember(communityId, {
      userId,
      reason,
    });

    showToastSuccess(response);
  } catch (e) {
    console.error('\x1b[31m🐣️ action reportMember error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default reportMember;
