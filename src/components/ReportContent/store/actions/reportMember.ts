import GroupApi from '~/api/GroupApi';
import { IPayloadReportMember } from '~/interfaces/IReport';
import useModalStore from '~/store/modal';
import showToastError from '~/store/helper/showToastError';

const reportMember = () => async (payload: IPayloadReportMember) => {
  const { targetId: userId, communityId, reason } = payload || {};

  try {
    await GroupApi.reportMember(communityId, {
      userId,
      reason,
    });

    useModalStore.getState().actions.showToast({ content: 'common:text_report_sent' });
  } catch (e) {
    console.error('\x1b[31m🐣️ action reportMember error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default reportMember;
