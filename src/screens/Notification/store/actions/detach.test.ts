import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';

describe('detach notification function', () => {
  it('should remove a noti success', () => {
    const mockNoti = {
      id: '1',
      notificationFlag: 'NOMARL',
    };

    useNotificationStore.setState((state) => {
      state.tabAll.data = [mockNoti.id];
      state.unseenNumber = 1;
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.unseenNumber).toBe(1);
    expect(result.current.tabAll.data.length).toBe(1);

    act(() => {
      result.current.actions.detach(mockNoti);
    });
    expect(result.current.unseenNumber).toBe(0);
    expect(result.current.tabAll.data.length).toBe(0);
  });
});
