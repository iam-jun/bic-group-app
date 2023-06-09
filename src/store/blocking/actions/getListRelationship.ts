import userApi from '~/api/UserApi';
import showToastError from '~/store/helper/showToastError';

const getListRelationship
  = (set, get) => async (isRefreshing = false) => {
    try {
      const { hasNextPage } = get();

      if (!isRefreshing && !hasNextPage) return;

      set(
        {
          loading: !isRefreshing,
          refreshing: isRefreshing,
        },
        'getListRelationshipFetching',
      );

      const response = await userApi.getListRelationship();

      if (response && response?.data) {
        const { data } = response;
        set(
          {
            listRelationship: data,
            loading: false,
            refreshing: false,
            hasNextPage: false,
          },
          'getListRelationshipSuccess',
        );
      }
    } catch (e) {
      console.error('\x1b[31m🐣️ getListRelationship error: ', e, '\x1b[0m');
      set(
        {
          loadingRelationship: false,
          refreshing: false,
          hasNextPage: false,
        },
        'getListRelationshipFailed',
      );
      showToastError(e);
    }
  };

export default getListRelationship;
