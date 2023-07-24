import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';

describe('delete notification in local function', () => {
  it('should do nothing if notificationId is empty', () => {
    const notificationId = '';
    const mockNoti = {
      id: '2',
      notificationFlag: 'NOMARL',
      extra: {
        type: 'comment.to_mentioned_user.in_comment',
        actors: [
          {
            id: '623',
            avatar: '',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
          },
        ],
        description: '**Linh Linh** posted in **3** groups',
        content: 'ửyseryesr',
      },
      updated_at: '2023-02-16T02:50:28.238Z',
    };

    useNotificationStore.setState((state) => {
      state.notificationList = { 2: mockNoti };
      state.waitingForDelete = [];
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(0);

    act(() => {
      result.current.actions.deleteNotificationLocal(notificationId);
    });
    expect(result.current.waitingForDelete.length).toBe(0);
    expect(result.current.notificationList).toEqual({ 2: mockNoti });
  });

  it('should delete notification in local success', () => {
    const notificationId = '1';
    const mockNoti = {
      id: '1',
      notificationFlag: 'NOMARL',
      extra: {
        type: 'comment.to_mentioned_user.in_comment',
        actors: [
          {
            id: '623',
            avatar: '',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
          },
        ],
        description: '**Linh Linh** posted in **3** groups',
        content: 'ửyseryesr',
      },
      updated_at: '2023-02-16T02:50:28.238Z',
    };

    useNotificationStore.setState((state) => {
      state.notificationList = { 1: mockNoti };
      state.waitingForDelete = [];
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(0);

    act(() => {
      result.current.actions.deleteNotificationLocal(notificationId);
    });
    expect(result.current.waitingForDelete.length).toBe(1);
    expect(result.current.notificationList[notificationId]?.deleted).toBeTruthy();
  });
});
