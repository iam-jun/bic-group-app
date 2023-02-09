import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import groupApi from '~/api/GroupApi';
import { IFilterToolbarState } from '..';
import appConfig from '~/configs/appConfig';

const searchPostUsers = (set, get) => async (contentSearch?: string, isLoadMore?: boolean) => {
  try {
    if (!isLoadMore) {
      set((state: IFilterToolbarState) => {
        state.search.loading = true;
        state.search.hasNextPage = true;
        state.search.items = [];
      }, 'resetSearchPostUser');
    }
    const filterToolbarData: IFilterToolbarState = get();
    const listUserSearched = filterToolbarData.search;
    const {
      hasNextPage, loading, groupId, items,
    } = listUserSearched;

    if (!!isLoadMore && (!hasNextPage || loading)) {
      return;
    }

    set((state: IFilterToolbarState) => {
      state.search.loading = true;
    }, isLoadMore ? 'searchPostUserLoadMore' : 'searchPostUser');

    const params: IParamsGetUsers = {
      key: contentSearch,
      limit: appConfig.recordsPerPage,
      offset: isLoadMore ? items?.length : 0,
    };

    if (groupId) {
      params.groupId = groupId;
    }

    const response = await groupApi.getUsers(params);

    const listResult = response?.data || [];
    const newListUser = isLoadMore ? [...listUserSearched.items, ...listResult] : listResult;
    const newHasNextPage = response?.meta?.hasNextPage;

    set((state: IFilterToolbarState) => {
      state.search.key = contentSearch;
      state.search.loading = false;
      state.search.items = newListUser;
      state.search.hasNextPage = newHasNextPage;
    }, 'searchPostUserSuccess');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga searchPostUsers error: ', e, '\x1b[0m',
    );
  }
};

export default searchPostUsers;
