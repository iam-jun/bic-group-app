import userApi from '~/api/UserApi';
import showToastError from '~/store/helper/showToastError';

// This sprint 36: not have paging, only get list only 1 time
// Pre-declare pagination variables for later reuse
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

      const response = await userApi.getListBlockingUsers();

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
