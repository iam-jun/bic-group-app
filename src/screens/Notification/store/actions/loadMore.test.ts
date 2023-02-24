import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import { IParamGetNotifications } from '~/interfaces/INotification';
import notificationApi from '~/api/NotificationApi';

const mockTabAllData = ['1', '2'];
const mockData = [{ id: '3' }, { id: '4' }, { id: '5' }];
const mockNotifications = { 1: { id: '1' }, 2: { id: '2' } };

describe('loadMore function', () => {
  it('load more notification successfully', async () => {
    const response = {
      code: 200,
      results: mockData,
      unseen: 1,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const params:IParamGetNotifications = {
      keyValue: 'tabAll',
    };

    const expectNotifications = {
      1: { id: '1' }, 2: { id: '2' }, 3: { id: '3' }, 4: { id: '4' }, 5: { id: '5' },
    };

    useNotificationStore.setState((state) => {
      state.notificationList = mockNotifications;
      state.tabAll.data = mockTabAllData;
      return state;
    });

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.tabAll.isLoadingMore).toBeFalsy();
    expect(result.current.tabAll.data.length).toEqual(mockTabAllData.length);

    act(() => {
      result.current.actions.loadMore(params);
    });
    expect(result.current.tabAll.isLoadingMore).toBeTruthy();
    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.tabAll.isLoadingMore).toBeFalsy();
    expect(result.current.tabAll.data.length).toEqual(mockData.length + mockTabAllData.length);
    expect(result.current.notificationList).toEqual(expectNotifications);
  });

  it('load more notification successfully with no data', async () => {
    const response = {
      code: 200,
      results: [],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationStore.setState((state) => {
      state.notificationList = mockNotifications;
      state.tabAll.data = mockTabAllData;
      return state;
    });

    const params:IParamGetNotifications = {
      keyValue: 'tabAll',
    };

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.tabAll.isLoadingMore).toBeFalsy();
    expect(result.current.tabAll.data.length).toEqual(mockTabAllData.length);

    act(() => {
      result.current.actions.loadMore(params);
    });
    expect(result.current.tabAll.isLoadingMore).toBeTruthy();
    expect(result.current.tabAll.noMoreData).toBeFalsy();

    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.tabAll.noMoreData).toBeTruthy();
    expect(result.current.tabAll.data.length).toBe(mockTabAllData.length);
  });

  it('should load more notifications throw error', async () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const params:IParamGetNotifications = {
      keyValue: 'tabAll',
    };

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));

    expect(result.current.tabAll.isLoadingMore).toBeFalsy();
    expect(result.current.tabAll.data.length).toEqual(0);

    act(() => {
      try {
        result.current.actions.loadMore(params);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.tabAll.isLoadingMore).toBeTruthy();

    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.tabAll.isLoadingMore).toBeFalsy();
    expect(result.current.tabAll.data.length).toEqual(0);
  });
});
