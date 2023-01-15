import { checkIfHasPermission } from '../helper';

const shouldHavePermission = (_set, get) => (
  id: string,
  requiredPermissions: string | string[],
) => {
  const { data } = get();

  /**
   * we use scope `groups` only
   * scope `community` is used for admin panel on web
   */
  const availablePermissions: string[] = data?.groups?.[id] || [];

  return checkIfHasPermission(requiredPermissions, availablePermissions);
};

export default shouldHavePermission;
