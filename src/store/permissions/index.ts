import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import { createStore, resetStore } from '../utils';
import getMyPermissions from './actions/getMyPermissions';
import shouldHavePermission from './actions/shouldHavePermission';
import shouldHavePermissionOnSomeAudience from './actions/shouldHavePermissionOnSomeAudience';
import getAudienceListWithNoPermission from './actions/getAudienceListWithNoPermission';

export interface IMyPermissionsState extends IBaseState {
  loading: boolean;
  data: any;

  actions: {
    getMyPermissions: () => void;
    shouldHavePermission: (id: string, requiredPermissions: string | string[]) => boolean;
    shouldHavePermissionOnSomeAudience: (
      audiences: any[],
      requiredPermissions: string | string[],
    ) => boolean;
    getAudienceListWithNoPermission: (
      audiences: any[],
      requiredPermissions: string | string[],
    ) => any[];
  }
}

const initialState: InitStateType<IMyPermissionsState> = {
  loading: false,
  data: {},
};

const myPermissionsStore = (set, get) => ({
  ...initialState,

  actions: {
    getMyPermissions: getMyPermissions(set, get),
    shouldHavePermission: shouldHavePermission(set, get),
    shouldHavePermissionOnSomeAudience: shouldHavePermissionOnSomeAudience(set, get),
    getAudienceListWithNoPermission: getAudienceListWithNoPermission(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useMyPermissionsStore = createStore<IMyPermissionsState>(myPermissionsStore);

export default useMyPermissionsStore;
