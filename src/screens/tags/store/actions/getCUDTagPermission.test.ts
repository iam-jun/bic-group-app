import groupApi from '~/api/GroupApi';
import useTagsControllerStore, { ITagsController } from '../index';
import { act, renderHook } from '~/test/testUtils';
import useModalStore from '~/store/modal';

describe('getCommunityCUDTagPermission', () => {
  const communityId = '1';

  it('should getPermission data successfully', () => {
    const response = {
      data: true,
    };

    const spy = jest.spyOn(groupApi, 'getCommunityCUDTagPermission').mockImplementation(
      () => Promise.resolve(response),
    );

    useTagsControllerStore.setState((state: ITagsController) => {
      state.communityCUDTagPermissions = {};
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useTagsControllerStore((state) => state));

    act(() => {
      result.current.actions.getCommunityCUDTagPermission(communityId);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityCUDTagPermissions[communityId]).toEqual(true);
  });

  it('should call API and throws an error', () => {
    const error = {
      meta: {
        message: 'Error getting permission',
      },
    };

    const spy = jest.spyOn(groupApi, 'getCommunityCUDTagPermission').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useTagsControllerStore((state) => state));

    act(() => {
      try {
        result.current.actions.getCommunityCUDTagPermission(communityId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'Error getting permission',
      type: 'error',
    });
  });
});
