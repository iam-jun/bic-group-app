import { act, renderHook } from '~/test/testUtils';
import useNotiSettingsStore from '../index';
import notificationApi from '~/api/NotificationApi';

describe('update noti config setting', () => {
  const mockGenericData = {
    name: 'generic',
    title: 'Allow notifications',
    enable: true,
    order: 1,
  };
  it('should update notification config success if has data name in store', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = { generic: mockGenericData };
      return state;
    });
    const response = {
      code: 200,
    };

    const payload = { name: 'generic', enable: false };
    const dataUpdateStore = { ...mockGenericData, enable: false };

    const spyApi = jest.spyOn(notificationApi, 'updateSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.updateSettings(payload, dataUpdateStore);
    });
    expect(result.current.loadingUpdate).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingUpdate).toBeFalsy();
    expect(result.current.data?.generic).toEqual(dataUpdateStore);
  });

  it('should do nothing if not has data name in store', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = { generic: mockGenericData };
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'updateSettings').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const payload = { name: 'test', enable: false };
    const dataUpdateStore = { name: 'test', enable: false };

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.updateSettings(payload, dataUpdateStore);
    });

    expect(result.current.loadingUpdate).toBeFalsy();
    expect(spyApi).not.toBeCalled();
  });

  it('should get series throw error and should show toast', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = { generic: mockGenericData };
      return state;
    });
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'updateSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const payload = { name: 'generic', enable: false };
    const dataUpdateStore = { ...mockGenericData, enable: false };

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.updateSettings(payload, dataUpdateStore);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingUpdate).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingUpdate).toBeFalsy();
    expect(result.current.data?.generic).not.toEqual(dataUpdateStore);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
