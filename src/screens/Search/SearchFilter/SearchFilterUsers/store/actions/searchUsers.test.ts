import { renderHook, waitFor } from '@testing-library/react-native';
import useModalStore from '~/store/modal';
import userApi from '~/api/UserApi';
import { userSearchResult } from '~/test/mock_data/home';
import useSearchFilterUsersStore from '../index';

describe('searchUsers', () => {
  it('should get users success', async () => {
    const spyApiGetUsers = jest.spyOn(userApi, 'getUsers').mockReturnValue(Promise.resolve(userSearchResult));

    const { result } = renderHook(() => useSearchFilterUsersStore());

    result.current.actions.searchUsers('abc');

    expect(spyApiGetUsers).toBeCalled();

    await waitFor(() => {
      expect(result.current.search.items.length).toBe(userSearchResult.data.length);
    });
  });

  it('should get users failed', async () => {
    const spyApiGetUsers = jest.spyOn(userApi, 'getUsers').mockReturnValue(Promise.reject());

    const { result } = renderHook(() => useSearchFilterUsersStore());

    result.current.actions.searchUsers('abc');

    expect(spyApiGetUsers).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
