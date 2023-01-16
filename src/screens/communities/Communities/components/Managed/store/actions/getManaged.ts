const getManaged
  = (set, get) => async (isRefreshing?: boolean) => {
    try {
      const { getManagedCommunityAndGroup } = get().actions;

      set(
        {
          refreshing: isRefreshing,
        },
        'getManaged',
      );

      getManagedCommunityAndGroup(isRefreshing);

      set(
        {
          refreshing: false,
        },
        'getManaged',
      );
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ getManaged error: ',
        e,
        '\x1b[0m',
      );
      set(
        {
          refreshing: false,
        },
        'getManagedFailed',
      );
    }
  };

export default getManaged;
