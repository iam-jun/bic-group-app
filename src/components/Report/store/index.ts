import { isArray } from 'lodash';
import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import {
  IReportReason, IPayloadReportContent, IPayloadReportMember, IReportDetail, IReportedContents,
} from '~/interfaces/IReport';
import getReportReasons from './actions/getReportReasons';
import getMemberReportReasons from './actions/getMemberReportReasons';
import reportContent from './actions/reportContent';
import reportMember from './actions/reportMember';
import { IObject } from '~/interfaces/common';
import { IPost } from '~/interfaces/IPost';
import getReportedContents from './actions/getReportedContents';
import reportMemberByUserId from './actions/reportMemberByUserId';

export interface IReportContentState extends IBaseState {
  reportedContents: IReportedContents;
  reportReasons: IReportReason;
  memberReportReasons: IReportReason;

  // Use case edit Post in Report Content. Because api edit Post not return "reportDetails" atttribute
  reportDetailsPost: IObject<IReportDetail[]>;

  actions: {
    getReportedContents: (isRefresh: boolean) => void;
    clearReportedContents: () => void;
    getReportReasons: () => void;
    getMemberReportReasons: () => void;
    reportContent: (payload: IPayloadReportContent) => void;
    reportMember: (payload: IPayloadReportMember) => void;
    reportMemberByUserId: (payload: IPayloadReportMember) => void;
    addToReportDetailsPost: (payload: IPost | IPost[]) => void;
  };
}

const initState: InitStateType<IReportContentState> = {
  reportedContents: {
    ids: [],
    loading: false,
    refreshing: true,
    hasNextPage: false,
  },
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
    getReportedContents: getReportedContents(set, get),
    clearReportedContents: () => {
      set((state: IReportContentState) => {
        state.reportedContents = initState.reportedContents;
      }, 'clearReportedContents');
    },
    getReportReasons: getReportReasons(set),
    getMemberReportReasons: getMemberReportReasons(set),
    reportContent: reportContent(),
    reportMember: reportMember(),
    reportMemberByUserId: reportMemberByUserId(),
    addToReportDetailsPost: (payload: IPost | IPost[]) => {
      const { reportDetailsPost } = get();
      const newReportDetailsPost = { ...reportDetailsPost };

      let postsData: IPost[];
      if (isArray(payload)) {
        postsData = [...payload];
      } else {
        postsData = [payload] as IPost[];
      }

      postsData.forEach((item: IPost) => {
        const { id, reportDetails } = item || {};
        newReportDetailsPost[id] = reportDetails;
      });

      set((state: IReportContentState) => {
        state.reportDetailsPost = newReportDetailsPost;
      }, 'addToReportDetailsPost');
    },
  },

  reset: () => resetStore(initState, set),
});

const useReportContentStore = createStore<IReportContentState>(reportContentStore);

export default useReportContentStore;
