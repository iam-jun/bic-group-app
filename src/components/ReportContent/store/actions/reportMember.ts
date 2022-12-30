import GroupApi from '~/api/GroupApi';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import showError from '~/store/helper/showError';
import { IPayloadReportMember } from '~/interfaces/IReport';

const reportMember = () => async (payload: IPayloadReportMember) => {
  const { targetId: userId, communityId, reason } = payload || {};

  try {
    await GroupApi.reportMember(communityId, {
      userId,
      reason,
    });

    Store.store.dispatch(
      modalActions.showHideToastMessage({ content: 'common:text_report_sent' }),
    );
  } catch (e) {
    console.error('\x1b[31m🐣️ action reportMember error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default reportMember;
