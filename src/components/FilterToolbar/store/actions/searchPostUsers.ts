import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import groupApi from '~/api/GroupApi';
import Store from '~/storeRedux';
import { IFilterToolbarState } from '..';
import appConfig from '~/configs/appConfig';

const searchPostUsers = (set, get) => async (contentSearch?: string, isLoadMore?: boolean) => {
  try {
    if (!contentSearch) {
      set((state: IFilterToolbarState) => {
        state.search.key = '';
        state.search.loading = false;
        state.search.items = [];
        state.search.hasNextPage = true;
      }, 'searchPostUserWithoutKey');
    }
    const filterToolbarData = get() || {};
    const listUserSearched = filterToolbarData.search || [];

    if (!!isLoadMore && !listUserSearched.hasNextPage) {
      return;
    }

    const { home } = Store.store.getState() || {};
    const { groupId } = home?.newsfeedSearch || {};

    set((state: IFilterToolbarState) => {
      state.search.key = contentSearch;
      state.search.loading = true;
    }, isLoadMore ? 'searchPostUserLoadMore' : 'searchPostUser');

    const params:IParamsGetUsers = {
      key: contentSearch,
      limit: appConfig.recordsPerPage,
      offset: isLoadMore ? listUserSearched?.items?.length : 0,
      groupId,
    };

    const response = await groupApi.getUsers(params);

    const listResult = response?.data || [];
    const newListUser = isLoadMore ? [...listUserSearched.items, ...listResult] : listResult;
    const hasNextPage = response?.meta?.hasNextPage;

    set((state: IFilterToolbarState) => {
      state.search.loading = false;
      state.search.items = newListUser;
      state.search.hasNextPage = hasNextPage;
    }, 'searchPostUserSuccess');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga searchPostUsers error: ', e, '\x1b[0m',
    );
  }
};

export default searchPostUsers;
