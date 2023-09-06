import { act, renderHook } from '~/test/testUtils';
import useMyInvitationsStore, { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import {
  mockGroupedInvitations,
  mockInvitationData,
  mockResposeErrorAlreadyCancelled, mockResposeListInvitation,
} from '~/test/mock_data/invitations';
import * as showToastError from '~/store/helper/showToastError';

describe('getInvitations in user profile', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if hasNextPage = false and isRefresh = false ', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      return state;
    });

    const spyApi = jest.spyOn(groupApi, 'getMyInvitations').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.getInvitations();
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should get invitations success if hasNextPage = false and isRefresh = true ', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      return state;
    });
    const spyApi = jest.spyOn(groupApi, 'getMyInvitations').mockImplementation(
      () => Promise.resolve(mockResposeListInvitation) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));
    act(() => {
      result.current.actions.getInvitations(true);
    });
    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.hasNextPage).toBeFalsy();
    expect(result.current.groupedInvitations).toEqual(mockGroupedInvitations);
    expect(result.current.currentInvitationIds).toEqual(mockResposeListInvitation.data.length);
    expect(result.current.invitationData).toEqual(mockInvitationData);
  });

  it('should get invitations failed and show error toast', () => {
    const spyApi = jest.spyOn(groupApi, 'getMyInvitations').mockImplementation(
      () => Promise.reject(mockResposeErrorAlreadyCancelled) as any,
    );
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useMyInvitationsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getInvitations();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(mockResposeErrorAlreadyCancelled);
      }
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApi).toBeCalled();
    expect(result.current.loading).toBeFalsy();
    expect(spyShowToastError).toBeCalled();
  });
});
