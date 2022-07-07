import {IPermission, IRole, IScheme} from '~/interfaces/IGroup';
import {ROLE_TYPE} from '~/constants/permissionScheme';

export const getNewSchemeFromSystemScheme = (systemScheme: IScheme) => {
  let memberRoleIndex = 0;
  const roleKeys = ['scope', 'type', 'permissions', 'name'];
  const roles = systemScheme.roles?.map((role: IRole, i: number) => {
    if (role?.type === ROLE_TYPE.MEMBER) {
      memberRoleIndex = i;
    }
    return roleKeys.reduce((filtered, key) => {
      // @ts-ignore
      if (role[key]) filtered[key] = role[key];
      return filtered;
    }, {});
  });
  const newScheme: IScheme = {
    name: '',
    description: '',
    roles: roles as IRole[],
  };
  return {newScheme, memberRoleIndex};
};

export const getNewSchemeRolesOnUpdatePermission = (
  permission: IPermission,
  roleIndex: number,
  roles: IRole[],
  memberRoleIndex: number,
) => {
  const newKey = permission?.key || '';
  const permissions = roles[roleIndex]?.permissions || [];
  if (permissions.includes?.(newKey)) {
    // key existed, should remove
    roles[roleIndex].permissions = permissions.filter(p => p !== newKey);

    if (roleIndex === memberRoleIndex) {
      // unchecking this member's permission will add it to other roles
      for (let index = 0; index < roles.length; index++) {
        const currentRole = roles[index];
        if (
          index !== roleIndex &&
          !currentRole.permissions?.includes?.(newKey) &&
          !(
            currentRole?.type === ROLE_TYPE.GROUP_ADMIN &&
            permission?.scope === 'COMMUNITY'
          )
        ) {
          currentRole.permissions.push(newKey);
        }
      }
    }
  } else {
    // add key
    permissions.push(newKey);
  }
  return [...roles];
};

export const getMemberRoleIndex = (schemeData: IScheme) => {
  let memberRoleIndex = 1;

  schemeData.roles?.map((role: IRole, i: number) => {
    if (role?.type === ROLE_TYPE.MEMBER) {
      memberRoleIndex = i;
      return;
    }
  });

  return memberRoleIndex;
};
