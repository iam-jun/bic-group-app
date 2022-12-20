const shouldHavePermissionOnSomeAudience = (_set, get) => (
  audiences: any[],
  requiredPermissions: string | string[],
) => {
  const { actions } = get();

  return (audiences || []).some((audience) => actions.shouldHavePermission(
    audience.id,
    requiredPermissions,
  ));
};

export default shouldHavePermissionOnSomeAudience;
