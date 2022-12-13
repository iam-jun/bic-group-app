import { resetStore, createStore } from '~/store/utils';

import getMyWorkExperience from './actions/getMyWorkExperience';

import { IUserWorkExperience } from '~/interfaces/IAuth';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IAccountSettingsState extends IBaseState {
    myWorkExperience: IUserWorkExperience[];
    actions: {
        getMyWorkExperience: () => void;

    };
}

const initState = {
  myWorkExperience: [],

};

const accountSettingsStore = (set, _get) => ({
  ...initState,
  actions: {
    getMyWorkExperience: getMyWorkExperience(set),

  },
  reset: () => resetStore(initState, set),
});

const useAccountSettingsStore = createStore<IAccountSettingsState>(accountSettingsStore);

export default useAccountSettingsStore;
