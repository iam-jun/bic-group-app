import GroupApi from '~/api/GroupApi';
import { IReportContentState } from '../index';

const getMemberReportReasons = (set) => async () => {
  try {
    set((state: IReportContentState) => {
      state.memberReportReasons.loading = true;
    }, 'getMemberReportReasons Fetching');

    const response = await GroupApi.getMemberReportReasons();

    set((state: IReportContentState) => {
      state.memberReportReasons.loading = false;
      state.memberReportReasons.data = response?.data;
    }, 'getMemberReportReasons Success');
  } catch (e) {
    console.error('\x1b[31m🐣️ action getMemberReportReasons error: ', e, '\x1b[0m');
    set((state: IReportContentState) => {
      state.memberReportReasons.loading = false;
      state.memberReportReasons.data = [];
    }, 'getMemberReportReasons Error');
  }
};

export default getMemberReportReasons;
