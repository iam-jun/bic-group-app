import {PERMISSION_KEY} from '~/constants/permissionScheme';

export const hasPermission = (
  requiredPermissions: string[],
  currentPermissions: string[],
) => {
  return [PERMISSION_KEY.FULL_PERMISSION, ...requiredPermissions].some(
    (per: string) => currentPermissions.includes(per),
  );
};
