import { IPermission, IRole, IScheme } from '~/interfaces/IGroup';
import { ROLE_TYPE } from '~/constants/permissionScheme';

export const getNewSchemeFromSystemScheme = (systemScheme: IScheme) => {
  let memberRoleIndex = 0;
  const roleKeys = ['scope', 'type', 'permissions', 'name'];
  const roles = systemScheme.roles?.map((
    role: IRole, i: number,
  ) => {
    if (role?.type === ROLE_TYPE.MEMBER) {
      memberRoleIndex = i;
    }
    return roleKeys.reduce(
      (
        filtered, key,
      ) => {
        if (role[key]) filtered[key] = role[key];
        return filtered;
      }, {},
    );
  });
  const newScheme: IScheme = {
    name: '',
    description: '',
    roles: roles as IRole[],
  };
  return { newScheme, memberRoleIndex };
};

export const getNewSchemeRolesOnUpdatePermission = (
  permission: IPermission,
  roleIndex: number,
  roles: IRole[],
  memberRoleIndex: number,
) => {
  const newKey = permission?.key || '';
  let permissions = roles[roleIndex]?.permissions || [];

  // key existed, should remove
  if (permissions.includes?.(newKey)) {
    permissions = permissions.filter((p) => p !== newKey);

    return roles.map((item, index) => {
      // current item
      if (index === roleIndex) return { ...item, permissions };

      // unchecking MEMBER's permission will add it to community & group admin roles
      if (roleIndex === memberRoleIndex) {
        // in community & group section
        if (!item.permissions?.includes?.(newKey)
          && !(
            item?.type === ROLE_TYPE.GROUP_ADMIN
            && permission?.scope === 'COMMUNITY'
          ) // group admin doesn't have permissions of community scope
        ) {
          return {
            ...item,
            permissions: [...item.permissions, newKey],
          };
        }
      }

      // other items
      return item;
    });
  }

  // add key
  permissions = [...permissions, newKey];

  return roles.map(
    (item, index) => (
      index === roleIndex ? { ...item, permissions } : item
    ),
  );
};

export const getMemberRoleIndex = (schemeData: IScheme) => {
  let memberRoleIndex = 1;

  schemeData.roles?.forEach((
    role: IRole, i: number,
  ) => {
    if (role?.type === ROLE_TYPE.MEMBER) {
      memberRoleIndex = i;
    }
  });

  return memberRoleIndex;
};
