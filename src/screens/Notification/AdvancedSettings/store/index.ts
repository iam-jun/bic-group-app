import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import { IEditNotificationSetting, INotiSettings } from '~/interfaces/INotification';
import getCommunitySettings from './actions/getCommunitySettings';
import getJoinedGroupFlat from './actions/getJoinedGroupFlat';
import { IGroup } from '~/interfaces/IGroup';

export interface IAdvancedNotiSettingsStore extends IBaseState {
  // community setting data
  communityData: { [communityId: string]: INotiSettings };
  // group setting data
  groupData: { [groupId: string]: IGroup[] };
  isLoading: boolean;
  isLoadingCommunitySettings: boolean;
  isLoadingGroupSettings: boolean;
  isLoadingJoinedGroup: boolean;
  isUpdatingCommunitySettings: boolean;
  isUpdatingGroupSettings: boolean;
  isRefreshing: boolean;
  joinedGroups: IGroup[];
  slelectedCommunity: any;

  actions: {
    setIsLoading: (isLoading: boolean) => void;
    setIsLoadingCommunitySettings: (isLoading: boolean) => void;
    setSelectedCommunity: (community: any) => void;
    getCommunitySettings: (communityId: string, isRefreshing?: boolean) => void;
    getJoinedGroupFlat: (communityId: string) =>void;
    updateCommunitySettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: INotiSettings) => void;
    updateGroupSettings: (
      params: IEditNotificationSetting,
      dataUpdateStore: INotiSettings) => void;
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
  slelectedCommunity: {},
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
        state.slelectedCommunity = community;
      }, 'setSelectedCommunity');
    },
    getCommunitySettings: getCommunitySettings(set, get),
    getJoinedGroupFlat: getJoinedGroupFlat(set, get),
  },
});

const useAdvancedNotiSettingsStore = createStore<IAdvancedNotiSettingsStore>(advancedNotiSettingsStore);

export default useAdvancedNotiSettingsStore;
