import { renderHook, act } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useMyPermissionsStore, { IMyPermissionsState } from '../index';

describe('getMyPermissions', () => {
  it('should call api and get data successfully', () => {
    const response = {
      code: 'api.ok',
      data: {
        communities: {},
        groups: {},
      },
      meta: {
        message: 'Success',
      },
    };

    const spy = jest.spyOn(groupApi, 'getMyPermissions').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      result.current.actions.getMyPermissions();
    });
    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(response.data);
  });

  it('should not call api when loading', () => {
    const response = {
      code: 'api.ok',
      data: {
        communities: {},
        groups: {},
      },
      meta: {
        message: 'Success',
      },
    };

    const spy = jest.spyOn(groupApi, 'getMyPermissions').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.loading = true;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      result.current.actions.getMyPermissions();
    });
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call API and thow server error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getMyPermissions').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.loading = false;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getMyPermissions();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.loading).toBe(false);
  });
});
