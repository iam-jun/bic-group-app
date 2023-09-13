import { act, renderHook } from '~/test/testUtils';
import useNotiInvitationsStore, { INotiInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import {
  mockResposeErrorAlreadyAccepted, mockResposeErrorAlreadyCancelled, mockResposeSuccess,
} from '~/test/mock_data/invitations';

describe('acceptInvitation in noti', () => {
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
    const spyApi = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.acceptInvitation(undefined);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if notificationId is requesting', () => {
    const notiInfo = { id: '1' };
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsAccept = { 1: true };
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.acceptInvitation(notiInfo);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should accept invition success', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsAccept = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(
      () => Promise.resolve(mockResposeSuccess) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));
    act(() => {
      result.current.actions.acceptInvitation(notiInfo);
    });
    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_invitation_accepted');
  });

  it('should accept invition failed with is already accepted', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsAccept = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyAccepted) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.acceptInvitation(notiInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyAccepted);
      }
    });

    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_you_have_previously_joined');
  });

  it('should accept invition failed with is already cancelled', () => {
    useNotiInvitationsStore.setState((state: INotiInvitationsStore) => {
      state.requestingsAccept = {};
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'acceptInvitation').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyCancelled) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotiInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.acceptInvitation(notiInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyCancelled);
      }
    });

    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsAccept?.[notiInfo.id]).toBe(undefined);
    expect(result.current.needToChangeNote?.[notiInfo.id]).toBe(true);
    expect(result.current.textNotedList?.[notiInfo.id]).toBe('notification:text_invitation_has_been_canceled');
  });
});
