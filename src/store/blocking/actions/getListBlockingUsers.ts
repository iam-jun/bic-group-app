import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';

const getListBlockingUsers
  = (set, get) => async (isRefreshing = false) => {
    try {
      const { hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;

      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'getListBlockingUsersFetching',
      );

      const response = await groupApi.getListBlockingUsers();

      if (response && response?.data) {
        const { data } = response;
        set(
          {
            list: data,
            loading: false,
            refreshing: false,
            hasNextPage: false,
          },
          'getListBlockingUsersSuccess',
        );
      }
    } catch (e) {
      console.error('\x1b[31m🐣️ getListBlockingUsers error: ', e, '\x1b[0m');
      set(
        {
          loading: false,
          refreshing: false,
          hasNextPage: false,
        },
        'getListBlockingUsersFailed',
      );
      showToastError(e);
    }
  };

export default getListBlockingUsers;
