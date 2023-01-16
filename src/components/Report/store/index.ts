import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import {
  IReportReason, IPayloadReportContent, IPayloadReportMember, IReportDetail,
} from '~/interfaces/IReport';
import getReportReasons from './actions/getReportReasons';
import getMemberReportReasons from './actions/getMemberReportReasons';
import reportContent from './actions/reportContent';
import reportMember from './actions/reportMember';
import { IObject } from '~/interfaces/common';
import { IPost } from '~/interfaces/IPost';

export interface IReportContentState extends IBaseState {
  reportReasons: IReportReason;
  memberReportReasons: IReportReason;

  // Use case edit Post in Report Content. Because api edit Post not return "reportDetails" atttribute
  reportDetailsPost: IObject<IReportDetail[]>;

  actions: {
    getReportReasons: () => void;
    getMemberReportReasons: () => void;
    reportContent: (payload: IPayloadReportContent) => void;
    reportMember: (payload: IPayloadReportMember) => void;
    addToReportDetailsPost: (payload: IPost) => void;
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
  reportDetailsPost: {},
};

const reportContentStore = (set, get) => ({
  ...initState,

  actions: {
    getReportReasons: getReportReasons(set),
    getMemberReportReasons: getMemberReportReasons(set),
    reportContent: reportContent(),
    reportMember: reportMember(),
    addToReportDetailsPost: (payload: IPost) => {
      const { id, reportDetails } = payload || {};
      const { reportDetailsPost } = get();
      const newReportDetailsPost = { ...reportDetailsPost };
      newReportDetailsPost[id] = reportDetails;
      set((state: IReportContentState) => {
        state.reportDetailsPost = newReportDetailsPost;
      }, 'addToReportDetailsPost');
    },
  },

  reset: () => resetStore(initState, set),
});

const useReportContentStore = createStore<IReportContentState>(reportContentStore);

export default useReportContentStore;
