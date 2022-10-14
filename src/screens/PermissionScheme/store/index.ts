import { cloneDeep } from 'lodash';
import { createStore, resetStore } from '~/store/utils';
import assignSchemesToGroups from './actions/assignSchemesToGroups';
import deleteGeneralScheme from './actions/deleteGeneralScheme';
import getGeneralScheme from './actions/getGeneralScheme';
import getGroupScheme from './actions/getGroupScheme';
import getGroupSchemeAssignments from './actions/getGroupSchemeAssignments';
import getPermissionCategories from './actions/getPermissionCategories';
import getSchemes from './actions/getSchemes';
import getSystemScheme from './actions/getSystemScheme';
import updateCreatingSchemePermission from './actions/updateCreatingSchemePermission';
import updateGeneralScheme from './actions/updateGeneralScheme';
import updateGroupScheme from './actions/updateGroupScheme';
import IPermissionSchemeState from './Interface';

const initState = {
  categories: {
    loading: false,
    data: undefined,
  },
  systemScheme: {
    loading: false,
    data: undefined,
  },
  generalScheme: {
    loading: false,
    data: undefined,
    deleting: false,
  },
  schemes: {
    loading: false,
    data: {
      generalScheme: undefined,
      groupSchemes: undefined,
    },
    allSchemes: undefined,
  },
  creatingScheme: {
    data: undefined,
    memberRoleIndex: 2,
    creating: false,
  },
  groupScheme: {
    // storing this data for comparing original group scheme and editing scheme
    data: undefined,
  },
  assignGroupScheme: {
    assignments: {
      loading: false,
      data: undefined,
    },
    assigning: {
      loading: false,
      data: [],
      currentAssignments: undefined,
    },
  },
};

const permissionSchemeStore = (set, get) => ({
  ...initState,

  actions: {
    resetToInitState: (
      field: 'schemes' | 'generalScheme' | 'creatingScheme' | 'groupScheme' | 'assignGroupScheme',
    ) => {
      set((state: IPermissionSchemeState) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state[field] = initState[field];
      }, `resetToInitState ${field}`);
    },

    setCreatingScheme: (payload: {
      data?: any;
      memberRoleIndex?: number;
      creating?: boolean;
    }) => {
      set((state: IPermissionSchemeState) => {
        state.creatingScheme = {
          ...state.creatingScheme,
          ...payload,
        };
      }, 'setCreatingScheme');
    },
    setCreatingSchemeData: (payload?: any) => {
      set((state: IPermissionSchemeState) => {
        state.creatingScheme.data = payload ? Object.assign(
          cloneDeep(state.creatingScheme.data), payload,
        ) : initState.creatingScheme.data;
      }, 'setCreatingSchemeData');
    },
    updateCreatingSchemePermission: updateCreatingSchemePermission(set, get),
    setGroupSchemeAssigning: (payload: {
      data?: any;
      loading?: boolean;
      currentAssignments?: any;
    }) => {
      set((state: IPermissionSchemeState) => {
        state.assignGroupScheme.assigning = payload;
      }, 'setGroupSchemeAssigning');
    },

    getSchemes: getSchemes(set),
    getPermissionCategories: getPermissionCategories(set),
    getSystemScheme: getSystemScheme(set),
    getGeneralScheme: getGeneralScheme(set),
    updateGeneralScheme: updateGeneralScheme(set, get),
    deleteGeneralScheme: deleteGeneralScheme(set),
    getGroupScheme: getGroupScheme(set, get),
    updateGroupScheme: updateGroupScheme(set, get),
    getGroupSchemeAssignments: getGroupSchemeAssignments(set),
    assignSchemesToGroups: assignSchemesToGroups(set, get),
  },

  reset: () => resetStore(initState, set),
});

const usePermissionSchemeStore = createStore<IPermissionSchemeState>(permissionSchemeStore);

export default usePermissionSchemeStore;
