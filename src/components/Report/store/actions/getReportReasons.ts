import GroupApi from '~/api/GroupApi';
import { IReportContentState } from '../index';
import { timeOut } from '~/utils/common';

const getReportReasons = (set) => async () => {
  try {
    set((state: IReportContentState) => {
      state.reportReasons.loading = true;
    }, 'getReportReasons Fetching');

    const response = await GroupApi.getReportReasons();
    await timeOut(300);
    set((state: IReportContentState) => {
      state.reportReasons.loading = false;
      state.reportReasons.data = response?.data;
    }, 'getReportReasons Success');
  } catch (e) {
    console.error('\x1b[31m🐣️ action getReportReasons error: ', e, '\x1b[0m');
    set((state: IReportContentState) => {
      state.reportReasons.loading = false;
      state.reportReasons.data = [];
    }, 'getReportReasons Error');
  }
};

export default getReportReasons;
