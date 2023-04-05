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
  onSuccess?: () => void
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
  actions: {
    updatePinAudiences: (pinAudiences: PinAudiences) => void;
    updateGroupPinContent: (params: UpdateGroupPinContentParams) => void;
    updatePinContent: (params: UpdatePinContentParams) => void;
    getPinContentsGroup: () => void;
    getPinnableAudiences: (postId: string) => void;
    togglePinAudience: (audienceId: string) => void;
    resetPinAudiences: () => void;
  };
}

const initialState: InitStateType<IPinContentState> = {
  groupPinContent: {},
  pinAudiences: {},
  prevAudiences: [],
  isLoading: false,
  isLoadingPinnableAudiences: false,
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
        state.isLoading = false;
        state.isLoadingPinnableAudiences = false;
        state.prevAudiences = initialState.prevAudiences;
      }, 'resetPinAudiences');
    },
  },
  reset: () => resetStore(initialState, set),
});

const usePinContentStore = createStore<IPinContentState>(usePinContent);

export default usePinContentStore;
