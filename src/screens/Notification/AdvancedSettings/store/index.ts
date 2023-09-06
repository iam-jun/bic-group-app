import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import { IAdvancedNotificationSettings, IEditNotificationSetting, IGroupNotificationSetting } from '~/interfaces/INotification';
import getCommunitySettings from './actions/getCommunitySettings';
import { IGetCommunityGroup } from '~/interfaces/IGroup';
import getGroupSettings from './actions/getGroupSettings';
import updateGroupSettings from './actions/updateGroupSettings';
import updateCommunitySettings from './actions/updateCommunitySettings';
import searchJoinedGroupFlat from './actions/searchJoinedGroupFlat';
import getJoinedGroup from './actions/getJoinedGroup';

export interface IAdvancedNotiSettingsStore extends IBaseState {
  // community setting data
  communityData: { [communityId: string]: IAdvancedNotificationSettings };
  // group setting data
  groupData: { [groupId: string]: IGroupNotificationSetting };
  isLoading: boolean;
  isLoadingCommunitySettings: boolean;
  isLoadingGroupSettings: boolean;
  isLoadingJoinedGroup: boolean;
  isLoadingSearchJoinedGroup: boolean;
  isUpdatingCommunitySettings: boolean;
  isUpdatingGroupSettings: boolean;
  isResetOrEnableGroupSettings: boolean;
  isRefreshing: boolean;
  joinedGroups: string[];
  searchJoinedGroups: string[];
  selectedCommunity: any;
  hasNextPage: boolean;
  hasSearchNextPage: boolean;

  actions: {
    setIsLoading: (isLoading: boolean) => void;
    setIsLoadingCommunitySettings: (isLoading: boolean) => void;
    setSelectedCommunity: (community: any) => void;
    getCommunitySettings: (communityId: string, isRefreshing?: boolean) => void;
    getJoinedGroup: (communityId: string, isRefresh?: boolean) =>void;
    searchJoinedGroupFlat: (params: IGetCommunityGroup, isRefresh?:boolean) => void;
    getGroupSettings: (groupIds: string[]) => void;
    updateCommunitySettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: IAdvancedNotificationSettings) => void;
    updateGroupSettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: IGroupNotificationSetting,
      isResetOrEnableSettings?: boolean,
    ) => void;
    clearSearchGroup: () => void;
  },
}

const initialState = {
  communityData: {},
  groupData: {},
  isLoading: false,
  isLoadingCommunitySettings: false,
  isLoadingGroupSettings: false,
  isLoadingJoinedGroup: false,
  isLoadingSearchJoinedGroup: false,
  isUpdatingCommunitySettings: false,
  isUpdatingGroupSettings: false,
  isResetOrEnableGroupSettings: false,
  isRefreshing: false,
  joinedGroups: [],
  searchJoinedGroups: [],
  selectedCommunity: {},
  hasNextPage: true,
  hasSearchNextPage: true,
};

const advancedNotiSettingsStore = (set, get) => ({
  ...initialState,
  actions: {
    setIsLoading: (isLoading: boolean) => {
      set((state: IAdvancedNotiSettingsStore) => {
        state.isLoading = isLoading;
      }, 'setIsLoading');
    },
    setIsLoadingCommunitySettings: (isLoading: boolean) => {
      set((state: IAdvancedNotiSettingsStore) => {
        state.isLoadingCommunitySettings = isLoading;
      }, 'setIsLoadingCommunitySettings');
    },
    setSelectedCommunity: (community: any) => {
      const { selectedCommunity, actions } = get();
      const currentComID = selectedCommunity?.communityId || selectedCommunity?.id;
      const newComID = community?.communityId || community?.id;
      if (newComID === currentComID) return;

      set((state: IAdvancedNotiSettingsStore) => {
        state.selectedCommunity = community;
      }, 'setSelectedCommunity');
      actions.getCommunitySettings(newComID);
      actions.getJoinedGroup(newComID, true);
    },
    getCommunitySettings: getCommunitySettings(set, get),
    getJoinedGroup: getJoinedGroup(set, get),
    getGroupSettings: getGroupSettings(set, get),
    searchJoinedGroupFlat: searchJoinedGroupFlat(set, get),
    updateGroupSettings: updateGroupSettings(set, get),
    updateCommunitySettings: updateCommunitySettings(set, get),
    clearSearchGroup: () => {
      set((state: IAdvancedNotiSettingsStore) => {
        state.searchJoinedGroups = [];
        state.hasSearchNextPage = true;
      }, 'clearSearchGroup');
    },
    clearSearchCommunity: () => {
      set((state: IAdvancedNotiSettingsStore) => {
        state.searchJoinedGroups = [];
        state.hasSearchNextPage = true;
      }, 'clearSearchGroup');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useAdvancedNotiSettingsStore = createStore<IAdvancedNotiSettingsStore>(advancedNotiSettingsStore);

export default useAdvancedNotiSettingsStore;
