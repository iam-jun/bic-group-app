import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getSettings from './actions/getSettings';

export interface IDataSettings {
  settings: {
    isInvitedOnly: boolean;
    isJoinApproval: boolean;
    isActiveGroupTerms: boolean;
    isActiveMembershipQuestions: boolean;
  };
  changeableSettings: {
    isJoinApproval: string;
    isInvitedOnly: string;
    isActiveGroupTerms: string;
    isActiveMembershipQuestions: string;
  };
}

interface IEffectedInnerGroups {
  name: string;
  icon: string;
  description: string;
}

export interface IMembershipPolicySettingsState extends IBaseState {
  data: IDataSettings;
  effectedInnerGroups: IEffectedInnerGroups[];
  actions: {
    getSettings: (groupId: string) => void;
    updateSettings: (payload: IDataSettings) => void;
    clearPreviewSettings: () => void;
  };
}

const initialState: InitStateType<IMembershipPolicySettingsState> = {
  data: {
    settings: {
      isInvitedOnly: false,
      isJoinApproval: false,
      isActiveGroupTerms: false,
      isActiveMembershipQuestions: false,
    },
    changeableSettings: {
      isJoinApproval: '',
      isInvitedOnly: '',
      isActiveGroupTerms: '',
      isActiveMembershipQuestions: '',
    },
  },
  effectedInnerGroups: [],
};

const useMembershipPolicySettings = (set, get): IMembershipPolicySettingsState => ({
  ...initialState,
  actions: {
    getSettings: getSettings(set, get),
    updateSettings: (payload: IDataSettings) => {
      set((state: IMembershipPolicySettingsState) => {
        state.data = payload || initialState.data;
      }, 'updateSettings');
    },
    clearPreviewSettings: () => {
      set((state: IMembershipPolicySettingsState) => {
        state.effectedInnerGroups = initialState.effectedInnerGroups;
      }, 'updateSettings');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useMembershipPolicySettingsStore = createStore<IMembershipPolicySettingsState>(useMembershipPolicySettings);

export default useMembershipPolicySettingsStore;
