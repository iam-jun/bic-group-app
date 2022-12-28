import { createStore, resetStore } from '~/store/utils';
import removeCommunityMember from './actions/removeCommunityMember';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getCommunityMembers from './actions/getCommunityMembers';
import searchCommunityMembers from './actions/searchCommunityMembers';
import { ISearchCommunityMembers, IRemoveCommunityMember } from '~/interfaces/ICommunity';

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

  actions: {
    getCommunityMembers: (groupId: string, isRefreshing?: boolean) => void;
    searchCommunityMembers: (params: ISearchCommunityMembers)=>void;
    removeCommunityMember: (params: IRemoveCommunityMember) => void;
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
};

const communityMemberStore = (set, get) => ({
  ...initialState,
  actions: {
    getCommunityMembers: getCommunityMembers(set, get),
    searchCommunityMembers: searchCommunityMembers(set, get),
    removeCommunityMember: removeCommunityMember(set, get),
  },
  reset: () => resetStore(initialState, set),

});

const useCommunityMemberStore = createStore<ICommunityMemberState>(communityMemberStore);

export default useCommunityMemberStore;
