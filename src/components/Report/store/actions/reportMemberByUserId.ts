import GroupApi from '~/api/GroupApi';
import { IPayloadReportMember } from '~/interfaces/IReport';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const reportMemberByUserId = () => async (payload: IPayloadReportMember) => {
  const { targetId: userId, reason } = payload || {};

  try {
    const response = await GroupApi.reportMemberByUserId(userId, {
      reason,
    });

    showToastSuccess(response);
  } catch (e) {
    console.error('\x1b[31m🐣️ action reportMemberByUserId error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default reportMemberByUserId;
