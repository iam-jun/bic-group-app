import { createStore, resetStore } from '~/store/utils';
import removeCommunityMember from './actions/removeCommunityMember';
import getCommunityMemberRequests from './actions/getCommunityMemberRequests';
import approveSingleCommunityMemberRequest from './actions/approveSingleCommunityMemberRequest';
import approveAllCommunityMemberRequests from './actions/approveAllCommunityMemberRequests';
import declineSingleCommunityMemberRequest from './actions/declineSingleCommunityMemberRequest';
import declineAllCommunityMemberRequests from './actions/declineAllCommunityMemberRequests';
import getCommunityMembers from './actions/getCommunityMembers';
import searchCommunityMembers from './actions/searchCommunityMembers';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import {
  IPayloadApproveSingleCommunityMemberRequest,
  IPayloadApproveAllCommunityMemberRequest,
  IPayloadDeclineSingleCommunityMemberRequest,
  IPayloadDeclineAllCommunityMemberRequests,
  IPayloadGetCommunityMemberRequests,
  IPayloadSetCommunityMemberRequests,
  ISearchCommunityMembers,
  IRemoveCommunityMember,
} from '~/interfaces/ICommunity';
import { IJoiningMember } from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';

export interface ICommunityMemberState extends IBaseState {
  communityMembers: {
    loading: boolean;
    canLoadMore: boolean;
    offset: number;
  };

  search: {
    data: any[];
    loading: boolean;
    canLoadMore: boolean;
  }

  communityMemberRequests: {
    total: number,
    loading: boolean,
    canLoadMore: boolean,
    ids: string[],
    items: IObject<IJoiningMember>,
  };
  // temporarily stores data for `undo` action
  undoCommunityMemberRequests: {
    total: number,
    loading: boolean,
    canLoadMore: boolean,
    ids: string[],
    items: IObject<IJoiningMember>,
  };

  actions: {
    getCommunityMembers: (groupId: string, isRefreshing?: boolean) => void;
    searchCommunityMembers: (params: ISearchCommunityMembers)=>void;
    removeCommunityMember: (params: IRemoveCommunityMember) => void;

    setCommunityMemberRequests: (payload: IPayloadSetCommunityMemberRequests) => void;
    resetCommunityMemberRequests: () => void;
    storeUndoCommunityMemberRequests: () => void;
    undoDeclinedCommunityMemberRequests: () => void;
    resetUndoCommunityMemberRequests: () => void;
    editCommunityMemberRequest: (payload: {id: string, data: any}) => void;

    getCommunityMemberRequests: (payload: IPayloadGetCommunityMemberRequests) => void;
    approveSingleCommunityMemberRequest: (payload: IPayloadApproveSingleCommunityMemberRequest) => void;
    approveAllCommunityMemberRequests: (payload: IPayloadApproveAllCommunityMemberRequest) => void;
    declineSingleCommunityMemberRequest: (payload: IPayloadDeclineSingleCommunityMemberRequest) => void;
    declineAllCommunityMemberRequests: (payload: IPayloadDeclineAllCommunityMemberRequests) => void;
  };
  reset: () => void;
}

const initialState: InitStateType<ICommunityMemberState> = {
  communityMembers: {
    loading: true,
    canLoadMore: true,
    offset: 0,
  },
  search: {
    data: [],
    loading: true,
    canLoadMore: true,
  },
  communityMemberRequests: {
    total: 0,
    loading: true,
    canLoadMore: true,
    ids: [],
    items: {},
  },
  undoCommunityMemberRequests: {
    total: 0,
    loading: null,
    canLoadMore: null,
    ids: [],
    items: {},
  },
};

const communityMemberStore = (set, get) => ({
  ...initialState,

  actions: {
    getCommunityMembers: getCommunityMembers(set, get),
    searchCommunityMembers: searchCommunityMembers(set, get),
    removeCommunityMember: removeCommunityMember(set, get),

    setCommunityMemberRequests: (payload: IPayloadSetCommunityMemberRequests) => {
      set((state: ICommunityMemberState) => {
        state.communityMemberRequests = {
          ...state.communityMemberRequests,
          ...payload,
        };
      }, 'setCommunityMemberRequests');
    },
    resetCommunityMemberRequests: () => {
      set((state: ICommunityMemberState) => {
        state.communityMemberRequests = initialState.communityMemberRequests;
      }, 'resetCommunityMemberRequests');
    },
    storeUndoCommunityMemberRequests: () => {
      set((state: ICommunityMemberState) => {
        state.undoCommunityMemberRequests = {
          ...state.communityMemberRequests,
        };
      }, 'storeUndoCommunityMemberRequests');
    },
    undoDeclinedCommunityMemberRequests: () => {
      set((state: ICommunityMemberState) => {
        state.communityMemberRequests = {
          ...state.undoCommunityMemberRequests,
        };
        state.undoCommunityMemberRequests = {
          ...initialState.undoCommunityMemberRequests,
        };
      }, 'undoDeclinedCommunityMemberRequests');
    },
    resetUndoCommunityMemberRequests: () => {
      set((state: ICommunityMemberState) => {
        state.undoCommunityMemberRequests = initialState.undoCommunityMemberRequests;
      }, 'resetUndoCommunityMemberRequests');
    },
    editCommunityMemberRequest: ({ id, data }) => {
      const { communityMemberRequests }: ICommunityMemberState = get();
      set((state: ICommunityMemberState) => {
        state.communityMemberRequests.items[id] = {
          ...communityMemberRequests.items[id],
          ...data,
        };
      }, 'editCommunityMemberRequest');
    },

    getCommunityMemberRequests: getCommunityMemberRequests(get),
    approveSingleCommunityMemberRequest: approveSingleCommunityMemberRequest(get),
    approveAllCommunityMemberRequests: approveAllCommunityMemberRequests(get),
    declineSingleCommunityMemberRequest: declineSingleCommunityMemberRequest(get),
    declineAllCommunityMemberRequests: declineAllCommunityMemberRequests(get),
  },
  reset: () => resetStore(initialState, set),
});

const useCommunityMemberStore = createStore<ICommunityMemberState>(communityMemberStore);

export default useCommunityMemberStore;
