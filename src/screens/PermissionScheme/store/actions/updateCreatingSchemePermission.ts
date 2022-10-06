import { cloneDeep } from 'lodash';
import { IPermission } from '~/interfaces/IGroup';
import { getNewSchemeRolesOnUpdatePermission } from '../../CreatePermissionScheme/helper';
import IPermissionSchemeState from '../Interface';

const updateCreatingSchemePermission = (set, get) => (
  { permission, roleIndex }: { permission: IPermission; roleIndex: number },
) => {
  const permissionSchemeData: IPermissionSchemeState = get();
  const { memberRoleIndex, data } = permissionSchemeData.creatingScheme;
  const { roles = [] } = data;
  const clonedCreatingSchemeData = cloneDeep(data);

  const newRoles = getNewSchemeRolesOnUpdatePermission(
    permission,
    roleIndex,
    roles,
    memberRoleIndex,
  );
  const newData = Object.assign(clonedCreatingSchemeData, { roles: newRoles });

  set((state: IPermissionSchemeState) => {
    state.creatingScheme.data = newData;
  });
};

export default updateCreatingSchemePermission;
