const getAudienceListWithNoPermission = (_set, get) => (
  audiences: any[],
  requiredPermissions: string | string[],
) => {
  const { actions } = get();

  return (audiences || []).filter(
    (audience) => !actions.shouldHavePermission(audience.id, requiredPermissions),
  );
};

export default getAudienceListWithNoPermission;
