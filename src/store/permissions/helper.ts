import { PermissionKey } from '~/constants/permissionScheme';

export const checkIfHasPermission = (
  requiredPermissions: string | string[],
  availablePermissions: string[],
) => {
  let requiredPermissionsArray = requiredPermissions;
  if (typeof requiredPermissions === 'string') {
    requiredPermissionsArray = [requiredPermissions];
  }

  return [PermissionKey.FULL_PERMISSION, ...requiredPermissionsArray].some(
    (per: string) => (availablePermissions || []).includes(per),
  );
};
