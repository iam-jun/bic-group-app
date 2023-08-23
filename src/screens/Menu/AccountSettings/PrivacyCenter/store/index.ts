import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import getPersonalInfoVisibility from './actions/getPersonalInfoVisibility';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';
import editPersonalInfoVisibility from './actions/editPersonalInfoVisibility';

export interface IPersonalInfoVisibilityState extends IBaseState {
  visibilityPrivacy: PERSONAL_INFORMATION_VISIBILITY_TYPE;
  loading: boolean;

  actions: {
    setErrorText: (error?: string) => void;
    getPersonalInfoVisibility: () => void;
    editPersonalInfoVisibility: (type: PERSONAL_INFORMATION_VISIBILITY_TYPE) => void;
  }
}

const initialState: InitStateType<IPersonalInfoVisibilityState> = {
  visibilityPrivacy: PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE,
  loading: false,
};

const useVisibilityPrivacy = (set, get) => ({
  ...initialState,
  actions: {
    getPersonalInfoVisibility: getPersonalInfoVisibility(set, get),
    editPersonalInfoVisibility: editPersonalInfoVisibility(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useVisibilityPrivacyStore = createStore<IPersonalInfoVisibilityState>(useVisibilityPrivacy);

export default useVisibilityPrivacyStore;
