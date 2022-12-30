import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IReportReason, IPayloadReportContent, IPayloadReportMember } from '~/interfaces/IReport';
import getReportReasons from './actions/getReportReasons';
import getMemberReportReasons from './actions/getMemberReportReasons';
import reportContent from './actions/reportContent';
import reportMember from './actions/reportMember';

export interface IReportContentState extends IBaseState {
  reportReasons: IReportReason;
  memberReportReasons: IReportReason;

  actions: {
    getReportReasons: () => void;
    getMemberReportReasons: () => void;
    reportContent: (payload: IPayloadReportContent) => void;
    reportMember: (payload: IPayloadReportMember) => void;
  };
}

const initState: InitStateType<IReportContentState> = {
  reportReasons: {
    data: [],
    loading: false,
  },
  memberReportReasons: {
    data: [],
    loading: false,
  },
};

const reportContentStore = (set) => ({
  ...initState,

  actions: {
    getReportReasons: getReportReasons(set),
    getMemberReportReasons: getMemberReportReasons(set),
    reportContent: reportContent(),
    reportMember: reportMember(),
  },

  reset: () => resetStore(initState, set),
});

const useReportContentStore = createStore<IReportContentState>(reportContentStore);

export default useReportContentStore;
