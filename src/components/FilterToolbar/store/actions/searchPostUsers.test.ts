import groupApi from '~/api/GroupApi';
import { userSearchResult } from '~/test/mock_data/home';
import { renderHook, act } from '~/test/testUtils';
import useFilterToolbarStore from '../index';

describe('searchPostUsers', () => {
  it('should refresh search if isLoadMore = false', () => {
    const spyApiGetUsers = jest.spyOn(groupApi, 'getUsers').mockImplementation(
      () => Promise.resolve(userSearchResult) as any,
    );

    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.searchPostUsers('k');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetUsers).toBeCalled();
    expect(result.current.search.loading).toEqual(false);
    expect(result.current.search.groupId).toEqual('');
    expect(result.current.search.key).toEqual('k');
    expect(result.current.search.hasNextPage).toEqual(false);
    expect(result.current.search.items.length).toEqual(userSearchResult.data.length);
  });

  it('should load more search if isLoadMore = true', () => {
    const spyApiGetUsers = jest.spyOn(groupApi, 'getUsers').mockImplementation(
      () => Promise.resolve(userSearchResult) as any,
    );

    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.setSearchUser({
        items: [
          {
            id: '92a1a9de-9cbb-41ee-b1d5-973ac3690e28',
            email: 'khang2@mailinator.com',
            avatar: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
            username: 'khang2',
            fullname: 'Khang2',
            createdAt: '2022-05-20T04:40:42.093Z',
            updatedAt: '2023-01-09T07:41:04.188Z',
            chatUserId: '6dswbr953jgd5qtytfnngcp69r',
            beinStaffRole: null,
            backgroundImgUrl: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
          },
        ],
      });
      result.current.actions.searchPostUsers('k', true);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetUsers).toBeCalled();
    expect(result.current.search.loading).toEqual(false);
    expect(result.current.search.groupId).toEqual('');
    expect(result.current.search.key).toEqual('k');
    expect(result.current.search.hasNextPage).toEqual(false);
    expect(result.current.search.items.length).toEqual(userSearchResult.data.length + 1);
  });
});
