import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';

describe('attach notification function', () => {
  it('should add a noti success', () => {
    const mockNoti = {
      id: '1',
      notificationFlag: 'NOMARL',
    };
    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.unseenNumber).toBe(0);
    expect(result.current.tabAll.data.length).toBe(0);
    expect(result.current.tabUnread.data.length).toBe(0);

    act(() => {
      result.current.actions.attach(mockNoti);
    });
    expect(result.current.unseenNumber).toBe(1);
    expect(result.current.tabAll.data.length).toBe(1);
    expect(result.current.tabUnread.data.length).toBe(1);
  });

  it('should add a noti in tab important success', () => {
    const mockNoti = {
      id: '1',
      notificationFlag: 'IMPORTANT',
    };
    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.unseenNumber).toBe(0);
    expect(result.current.tabAll.data.length).toBe(0);
    expect(result.current.tabUnread.data.length).toBe(0);
    expect(result.current.tabImportant.data.length).toBe(0);

    act(() => {
      result.current.actions.attach(mockNoti);
    });
    expect(result.current.unseenNumber).toBe(1);
    expect(result.current.tabAll.data.length).toBe(1);
    expect(result.current.tabUnread.data.length).toBe(1);
    expect(result.current.tabImportant.data.length).toBe(1);
  });

  it('should add a noti in tab mention success', () => {
    const mockNoti = {
      id: '1',
      notificationFlag: 'MENTION',
    };
    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.unseenNumber).toBe(0);
    expect(result.current.tabAll.data.length).toBe(0);
    expect(result.current.tabUnread.data.length).toBe(0);
    expect(result.current.tabMention.data.length).toBe(0);

    act(() => {
      result.current.actions.attach(mockNoti);
    });
    expect(result.current.unseenNumber).toBe(1);
    expect(result.current.tabAll.data.length).toBe(1);
    expect(result.current.tabUnread.data.length).toBe(1);
    expect(result.current.tabMention.data.length).toBe(1);
  });
});
