import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import { ISearchFilterUsersState } from '..';
import appConfig from '~/configs/appConfig';
import userApi from '~/api/UserApi';
import showToastError from '~/store/helper/showToastError';

const searchUsers = (set, get) => async (contentSearch?: string, isRefresh?: boolean) => {
  try {
    const { search }: ISearchFilterUsersState = get();
    const {
      hasNextPage, loading, groupId, items,
    } = search || {};

    if (loading || (!isRefresh && !hasNextPage)) {
      return;
    }

    set((state: ISearchFilterUsersState) => {
      state.search.key = contentSearch;
      state.search.loading = true;
    }, isRefresh ? 'searchUsers refresh' : 'searchUsers load more');

    const params: IParamsGetUsers = {
      key: contentSearch,
      limit: appConfig.recordsPerPage,
      offset: isRefresh ? 0 : items?.length,
    };

    if (groupId) {
      params.groupId = groupId;
    }

    const response = await userApi.getUsers(params);

    const listResult = response?.data || [];
    const newListUser = isRefresh ? listResult : [...items, ...listResult];
    const newHasNextPage = response?.meta?.hasNextPage;

    set((state: ISearchFilterUsersState) => {
      state.search.loading = false;
      state.search.items = newListUser;
      state.search.hasNextPage = newHasNextPage;
    }, 'searchUsers success');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ searchUsers error: ', e, '\x1b[0m',
    );
    set((state: ISearchFilterUsersState) => {
      state.search.loading = false;
    }, 'searchUsers failed');
    showToastError(e);
  }
};

export default searchUsers;
