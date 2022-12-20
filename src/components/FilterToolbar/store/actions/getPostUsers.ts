import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import groupApi from '~/api/GroupApi';
import Store from '~/storeRedux';
import { IFilterToolbarState } from '..';
import appConfig from '~/configs/appConfig';

const getPostUsers = (set, get) => async (isLoadMore?: boolean) => {
  try {
    const filterToolbarData = get() || [];
    const listUser = filterToolbarData.listUser || [];

    if (!!isLoadMore && !listUser.hasNextPage) {
      return;
    }

    const { home } = Store.store.getState() || {};
    const { groupId } = home?.newsfeedSearch || {};

    set((state: IFilterToolbarState) => {
      state.listUser.loading = true;
    }, isLoadMore ? 'getPostUserLoadMore' : 'getPostUser');

    const params:IParamsGetUsers = {
      limit: appConfig.recordsPerPage,
      offset: isLoadMore ? listUser?.items?.length : 0,
      groupId,
    };

    const response = await groupApi.getUsers(params);

    const listResult = response?.data || [];
    const newListUser = isLoadMore ? [...listUser.items, ...listResult] : listResult;
    const hasNextPage = response?.meta?.hasNextPage;

    set((state: IFilterToolbarState) => {
      state.listUser.loading = false;
      state.listUser.items = newListUser;
      state.listUser.hasNextPage = hasNextPage;
    }, 'getPostUserSuccess');
  } catch (e) {
    set((state: IFilterToolbarState) => {
      state.listUser.loading = false;
    }, 'getPostUserFailed');
    console.error(
      '\x1b[31m🐣️ saga getPostUsers error: ', e, '\x1b[0m',
    );
  }
};

export default getPostUsers;
