import { IAudienceGroup } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getPinnableAudiences from './actions/getPinnableAudiences';
import getPinContentsGroup from './actions/getPinContentsGroup';
import updateGroupPinContent from './actions/updateGroupPinContent';
import updatePinContent from './actions/updatePinContent';

export interface UpdateGroupPinContentParams {
  postId: string
  pinGroupIds?: string[]
  unpinGroupIds?: string[]
}
export interface UpdatePinContentParams {
  postId: string
  pinGroupIds?: string[]
  unpinGroupIds?: string[]
  onSuccess?: (res) => void
  onError?: (error) => void
}

export interface PinContent {
  isLoading: boolean;
  data: string[];
}

export interface AudiencePermitPin {
  group: IAudienceGroup;
  error: string;
}

export interface PinAudiences {
    [id: string]: AudiencePermitPin;
}

export interface IPinContentState extends IBaseState {
  groupPinContent: {
    [idGroup: string]: PinContent;
  };
  pinAudiences: PinAudiences;
  prevAudiences: IAudienceGroup[];
  isLoading: boolean;
  isLoadingPinnableAudiences: boolean;
  canLoadMorePinnableAudiences: boolean;
  actions: {
    updatePinAudiences: (pinAudiences: PinAudiences) => void;
    updateGroupPinContent: (params: UpdateGroupPinContentParams) => void;
    updatePinContent: (params: UpdatePinContentParams) => void;
    getPinnableAudiences: (postId: string) => void;
    togglePinAudience: (audienceId: string) => void;
    resetPinAudiences: () => void;
    getPinContentsGroup: (id: string) => void;
    initDataPinContentsGroup: (id: string) => void;
    resetDataPinContentsGroup: (id: string) => void;
  };
}

const initialState: InitStateType<IPinContentState> = {
  groupPinContent: {},
  pinAudiences: {},
  prevAudiences: [],
  isLoading: false,
  isLoadingPinnableAudiences: false,
  canLoadMorePinnableAudiences: true,
};

const usePinContent = (set, get): IPinContentState => ({
  ...initialState,
  actions: {
    updatePinAudiences: (pinAudiences: PinAudiences) => {
      set((state: IPinContentState) => {
        state.pinAudiences = pinAudiences;
      }, 'updatePinAudiences');
    },
    updateGroupPinContent: updateGroupPinContent(set, get),
    updatePinContent: updatePinContent(set, get),
    getPinContentsGroup: getPinContentsGroup(set, get),
    getPinnableAudiences: getPinnableAudiences(set, get),
    togglePinAudience: (audienceId: string) => {
      set((state: IPinContentState) => {
        const currentPinStateGroup = state.pinAudiences[audienceId].group.isPinned;
        state.pinAudiences[audienceId].group.isPinned = !currentPinStateGroup;
        state.pinAudiences[audienceId].error = '';
      }, 'togglePinAudience');
    },
    resetPinAudiences: () => {
      set((state: IPinContentState) => {
        state.pinAudiences = initialState.pinAudiences;
        state.isLoading = initialState.isLoading;
        state.isLoadingPinnableAudiences = initialState.isLoadingPinnableAudiences;
        state.prevAudiences = initialState.prevAudiences;
        state.canLoadMorePinnableAudiences = initialState.canLoadMorePinnableAudiences;
      }, 'resetPinAudiences');
    },
    initDataPinContentsGroup: (id: string) => {
      set((state: IPinContentState) => {
        state.groupPinContent[id] = {
          isLoading: false,
          data: [],
        };
      }, 'initDataPinContentsGroup');
    },
    resetDataPinContentsGroup: (id: string) => {
      set((state) => {
        state.groupPinContent[id] = {};
      }, 'resetDataPinContentsGroup');
    },
  },
  reset: () => resetStore(initialState, set),
});

const usePinContentStore = createStore<IPinContentState>(usePinContent);

export default usePinContentStore;
