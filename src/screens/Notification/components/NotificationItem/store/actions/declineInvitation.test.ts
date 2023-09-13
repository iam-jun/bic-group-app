import { act, renderHook } from '~/test/testUtils';
import useNotiInvitationsStore, { INotiInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import { mockResposeErrorAlreadyCancelled, mockResposeErrorAlreadyDeclined, mockResposeSuccess } from '~/test/mock_data/invitations';

describe('declineInvitation in noti', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const notiInfo = {
    id: '1',
    activities: [{
      invitation: {
        invitationId: 'invitationId',
      },
    }],
  };

  it('should do nothing if notiInfo is undefined', () => {
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(undefined);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if notificationId is requesting', () => {
    const notiInfo = { id: '1' };
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsDecline = { 1: true };
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(notiInfo);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should decline invition success', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsDecline = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(mockResposeSuccess) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(notiInfo);
    });
    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_invitation_declined');
  });

  it('should decline invition failed with is already declined', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsDecline = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyDeclined) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.declineInvitation(notiInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyDeclined);
      }
    });

    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_you_have_previously_declined');
  });

  it('should decline invition failed with is already cancelled', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsDecline = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyCancelled) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.declineInvitation(notiInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyCancelled);
      }
    });

    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsDecline?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_invitation_has_been_canceled');
  });
});
