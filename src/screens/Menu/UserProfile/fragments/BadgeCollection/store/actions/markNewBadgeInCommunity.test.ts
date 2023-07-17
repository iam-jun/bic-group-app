import { act, renderHook } from '~/test/testUtils';
import useUserBadge, { IUserBadgesState } from '../index';
import { mockBadgeList, mockBadges } from '~/test/mock_data/userProfile';
import groupApi from '~/api/GroupApi';

describe('markNewBadgeInCommunity function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should delete new badge successfully', () => {
    useUserBadge.setState((state: IUserBadgesState) => {
      state.badges = mockBadges;
      return state;
    });

    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spyCallApi = jest.spyOn(groupApi, 'markNewBadge').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.markNewBadgeInCommunity(mockBadgeList);
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.badges[mockBadgeList[0].id]?.isNew).toBeFalsy();
    expect(result.current.badges[mockBadgeList[1].id]?.isNew).toBeFalsy();
  });

  it('should do nothing if badge is empty', () => {
    const spyCallApi = jest.spyOn(groupApi, 'markNewBadge').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.markNewBadgeInCommunity([]);
    });

    expect(spyCallApi).not.toBeCalled();
  });

  it('should delete new badge of community and throw error', () => {
    const error = 'internal error';
    useUserBadge.setState((state: IUserBadgesState) => {
      state.badges = mockBadges;
      return state;
    });

    const spyCallApi = jest.spyOn(groupApi, 'markNewBadge').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));

    act(() => {
      try {
        result.current.actions.markNewBadgeInCommunity(mockBadgeList);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.badges[mockBadgeList[0].id]?.isNew).toBeTruthy();
    expect(result.current.badges[mockBadgeList[1].id]?.isNew).toBeTruthy();
  });
});
