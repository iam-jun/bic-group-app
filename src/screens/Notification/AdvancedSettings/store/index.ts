import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import { IAdvancedNotificationSettings, IEditNotificationSetting } from '~/interfaces/INotification';
import getCommunitySettings from './actions/getCommunitySettings';
import getJoinedGroupFlat from './actions/getJoinedGroupFlat';
import { IGetCommunityGroup, IGroup } from '~/interfaces/IGroup';
import getGroupSettings from './actions/getGroupSettings';
import updateGroupSettings from './actions/updateGroupSettings';
import updateCommunitySettings from './actions/updateCommunitySettings';
import searchJoinedGroupFlat from './actions/searchJoinedGroupFlat';

export interface IAdvancedNotiSettingsStore extends IBaseState {
  // community setting data
  communityData: { [communityId: string]: IAdvancedNotificationSettings };
  // group setting data
  groupData: { [groupId: string]: IAdvancedNotificationSettings };
  isLoading: boolean;
  isLoadingCommunitySettings: boolean;
  isLoadingGroupSettings: boolean;
  isLoadingJoinedGroup: boolean;
  isUpdatingCommunitySettings: boolean;
  isUpdatingGroupSettings: boolean;
  isRefreshing: boolean;
  joinedGroups: IGroup[];
  searchJoinedGroups: IGroup[];
  selectedCommunity: any;
  hasNextPage: boolean;
  hasSearchNextPage: boolean;

  actions: {
    setIsLoading: (isLoading: boolean) => void;
    setIsLoadingCommunitySettings: (isLoading: boolean) => void;
    setSelectedCommunity: (community: any) => void;
    getCommunitySettings: (communityId: string, isRefreshing?: boolean) => void;
    getJoinedGroupFlat: (communityId: string, isRefresh?: boolean) =>void;
    searchJoinedGroupFlat: (params: IGetCommunityGroup, isRefresh?:boolean) => void;
    getGroupSettings: (groupIds: string[]) => void;
    updateCommunitySettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: IAdvancedNotificationSettings) => void;
    updateGroupSettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: IAdvancedNotificationSettings,
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
  isUpdatingCommunitySettings: false,
  isUpdatingGroupSettings: false,
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
      set((state: IAdvancedNotiSettingsStore) => {
        state.selectedCommunity = community;
      }, 'setSelectedCommunity');
    },
    getCommunitySettings: getCommunitySettings(set, get),
    getJoinedGroupFlat: getJoinedGroupFlat(set, get),
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
