import { act, renderHook } from '~/test/testUtils';
import useMyInvitationsStore, { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import {
  mockGroupedInvitations, mockResposeErrorAlreadyDeclined, mockResposeListInvitation, mockResposeSuccess,
} from '~/test/mock_data/invitations';
import * as showToastSuccess from '~/store/helper/showToastSuccess';
import * as showToastError from '~/store/helper/showToastError';

describe('declineInvitation in user profile', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if invitationId is undefined', () => {
    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(undefined, 1);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if groupedInvitations is empty', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = [];
      return state;
    });

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(undefined, 1);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if requestingsDecline invitationId is true', () => {
    const invitationId = mockResposeListInvitation.data[0].id;
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = mockGroupedInvitations;
      state.requestingsDecline = {
        [invitationId]: true,
      };
      return state;
    });

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(invitationId, 1);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if can not find group index in groupedInvitations', () => {
    const invitationId = mockResposeListInvitation.data[0].id;
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = mockGroupedInvitations;
      state.requestingsDecline = {};
      return state;
    });

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(invitationId, 3);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should do nothing if can not find invitation index in data of groupedInvitations', () => {
    const invitationId = 'test';
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = mockGroupedInvitations;
      state.requestingsDecline = {};
      return state;
    });

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(invitationId, 1);
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should decline invition success', () => {
    const invitationId = mockResposeListInvitation.data[0].id;
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = mockGroupedInvitations;
      state.requestingsDecline = {};
      return state;
    });

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.resolve(mockResposeSuccess) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.declineInvitation(invitationId, 1);
    });

    expect(result.current.requestingsDecline?.[invitationId]).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();

    expect(result.current.requestingsDecline?.[invitationId]).toBe(undefined);
    expect(result.current.requestSent?.[invitationId]).toBeTruthy();
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should decline invition failed with is already declined', () => {
    const invitationId = mockResposeListInvitation.data[0].id;
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.groupedInvitations = mockGroupedInvitations;
      state.requestingsDecline = {};
      return state;
    });

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    const spyApi = jest.spyOn(groupApi, 'declineInvitation').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyDeclined) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.declineInvitation(invitationId, 1);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyDeclined);
      }
    });

    expect(result.current.requestingsDecline?.[invitationId]).toBe(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.requestingsDecline?.[invitationId]).toBe(undefined);
    expect(result.current.requestSent?.[invitationId]).toBeTruthy();
    expect(spyShowToastError).toBeCalled();
  });
});
