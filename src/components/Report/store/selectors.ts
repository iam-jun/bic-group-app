import { IReportContentState } from './index';

const reportSelector = {
  getReportDetailsPost: (id: string) => (state: IReportContentState) => state?.reportDetailsPost?.[id],
};

export default reportSelector;
