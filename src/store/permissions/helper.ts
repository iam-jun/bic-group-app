export const checkIfHasPermission = (
  requiredPermissions: string | string[],
  availablePermissions: string[],
) => {
  let requiredPermissionsArray = requiredPermissions;
  if (typeof requiredPermissions === 'string') {
    requiredPermissionsArray = [requiredPermissions];
  }

  return [...requiredPermissionsArray].some((per: string) => (availablePermissions || []).includes(per));
};
