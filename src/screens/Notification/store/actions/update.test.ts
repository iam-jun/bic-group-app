import useNotificationStore from '../index';
import { act, renderHook } from '~/test/testUtils';

describe('update notification function', () => {
  it('should update notification successfully', () => {
    const fakePayLoad = {
      id: '1',
      newField: 'test',
    };

    const fakeNotifications = { 1: { id: '1' }, 2: { id: '2' } };
    const expectNotifications = { 1: fakePayLoad, 2: { id: '2' } };
    useNotificationStore.setState((state) => {
      state.notificationList = fakeNotifications;
      state.unseenNumber = 1;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.notificationList).toEqual(fakeNotifications);
    expect(result.current.unseenNumber).toEqual(1);

    act(() => {
      result.current.actions.update(fakePayLoad);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.notificationList).toEqual(expectNotifications);
    expect(result.current.unseenNumber).toEqual(1);
  });

  it('should update notification successfully when the notification need update is seen', () => {
    const fakePayLoad = {
      id: '1',
      newField: 'test',
    };

    const fakeNotifications = { 1: { id: '1', isSeen: true }, 2: { id: '2' } };
    const expectNotifications = { 1: fakePayLoad, 2: { id: '2' } };
    useNotificationStore.setState((state) => {
      state.notificationList = fakeNotifications;
      state.unseenNumber = 1;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.notificationList).toEqual(fakeNotifications);
    expect(result.current.unseenNumber).toEqual(1);

    act(() => {
      result.current.actions.update(fakePayLoad);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.notificationList).toEqual(expectNotifications);
    expect(result.current.unseenNumber).toEqual(2);
  });
});
