import { IPayloadGroupSchemeAssignments, IPermission, IScheme } from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';

interface IPermissionSchemeState extends IBaseState {
  categories: {
    loading: boolean;
    data: any;
  },
  systemScheme: {
    loading: boolean;
    data: IScheme;
  },
  generalScheme: {
    loading: boolean;
    data: IScheme;
    deleting?: boolean;
  },
  schemes: {
    loading: boolean;
    data: {
      generalScheme: any;
      groupSchemes: any;
    },
    allSchemes: any;
  },
  creatingScheme: {
    data: IScheme;
    memberRoleIndex: number;
    creating: boolean;
  },
  groupScheme: {
    data: any;
  },
  assignGroupScheme: {
    assignments: {
      loading: boolean;
      data: any;
    },
    assigning: {
      loading?: boolean;
      data?: any[];
      currentAssignments?: any;
    },
  },

  actions: {
    resetToInitState: (
      field: 'schemes' | 'generalScheme' | 'creatingScheme' | 'groupScheme' | 'assignGroupScheme'
    ) => void;

    setCreatingScheme: (payload: {
      data?: any;
      memberRoleIndex?: number;
      creating?: boolean;
    }) => void;
    setCreatingSchemeData: (payload?: any) => void;
    updateCreatingSchemePermission: (
      payload: { permission: IPermission; roleIndex: number }
    ) => void;
    setGroupSchemeAssigning: (payload: {
      data?: any;
      loading?: boolean;
      currentAssignments?: any;
    }) => void;

    getSchemes: (payload: { communityId: string; isRefreshing?: boolean }) => void;
    getPermissionCategories: (scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => void;
    getSystemScheme: () => void;

    createGeneralScheme: (communityId: string) => void;
    getGeneralScheme: (communityId: string) => void;
    updateGeneralScheme: (communityId: string) => void;
    deleteGeneralScheme: (communityId: string) => void;

    getGroupScheme: (payload: { communityId: string; schemeId: string }) => void;
    updateGroupScheme: (payload: {communityId: string; schemeId: string}) => void;

    getGroupSchemeAssignments: (payload: {
      communityId: string;
      showLoading?: boolean;
    }) => void
    assignSchemesToGroups: (payload: IPayloadGroupSchemeAssignments) => void;
  },

}

export default IPermissionSchemeState;
