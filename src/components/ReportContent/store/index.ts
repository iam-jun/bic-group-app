import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IReportReason, IPayloadReportContent } from '~/interfaces/IReport';
import getReportReasons from './actions/getReportReasons';
import reportContent from './actions/reportContent';

export interface IReportContentState extends IBaseState {
  reportReasons: IReportReason;

  actions: {
    getReportReasons: () => void;
    reportContent: (params: IPayloadReportContent) => void;
  };
}

const initState: InitStateType<IReportContentState> = {
  reportReasons: {
    data: [],
    loading: false,
  },
};

const reportContentStore = (set) => ({
  ...initState,

  actions: {
    getReportReasons: getReportReasons(set),
    reportContent: reportContent(),
  },

  reset: () => resetStore(initState, set),
});

const useReportContentStore = createStore<IReportContentState>(reportContentStore);

export default useReportContentStore;
