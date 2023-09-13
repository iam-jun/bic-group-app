import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getPersonalPrivacySettings from './actions/getPersonalPrivacySettings';
import { INVITATION_PRIVACY_TYPE, PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';
import editPersonalInfoVisibility from './actions/editPersonalInfoVisibility';
import editInvitationPrivacy from './actions/editInvitationPrivacy';

export interface IPersonalInfoVisibilityState extends IBaseState {
  visibilityPrivacy: PERSONAL_INFORMATION_VISIBILITY_TYPE;
  loading: boolean;
  invitationPrivacy: INVITATION_PRIVACY_TYPE;

  actions: {
    setErrorText: (error?: string) => void;
    getPersonalPrivacySettings: () => void;
    editPersonalInfoVisibility: (type: PERSONAL_INFORMATION_VISIBILITY_TYPE) => void;
    editInvitationPrivacy: (type: INVITATION_PRIVACY_TYPE) => void;
  }
}

const initialState: InitStateType<IPersonalInfoVisibilityState> = {
  visibilityPrivacy: PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE,
  loading: false,
  invitationPrivacy: INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT,
};

const usePersonalPrivacy = (set, get) => ({
  ...initialState,
  actions: {
    getPersonalPrivacySettings: getPersonalPrivacySettings(set, get),
    editPersonalInfoVisibility: editPersonalInfoVisibility(set, get),
    editInvitationPrivacy: editInvitationPrivacy(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const usePersonalPrivacyStore = createStore<IPersonalInfoVisibilityState>(usePersonalPrivacy);

export default usePersonalPrivacyStore;
