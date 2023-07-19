import { act, renderHook } from '~/test/testUtils';
import useUserBadge, { MAX_BADGES } from '../index';
import { mockBadgeList, mockOwnedBadges } from '~/test/mock_data/userProfile';
import groupApi from '~/api/GroupApi';

describe('getOwnedBadges function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get owned badges successfully with empty badge', () => {
    const response = {
      code: 200,
      data: {
        ownedBadges: [], showingBadges: [], hasNew: false,
      },
    };

    const spyCallApi = jest.spyOn(groupApi, 'getOwnedBadges').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.getOwnedBadges();
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.ownBadges.length).toEqual(0);
    expect(result.current.dataSearch.length).toEqual(0);
    expect(result.current.showingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.choosingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.hasNewBadge).toBeFalsy();
    expect(result.current.totalBadges).toEqual(0);
    expect(result.current.badges).toEqual({});
  });

  it('should get owned badges successfully with less than 3 badges and more than 0', () => {
    const response = {
      code: 200,
      data: {
        ownedBadges: mockOwnedBadges,
        showingBadges: mockBadgeList,
        hasNew: true,
      },
    };

    const spyCallApi = jest.spyOn(groupApi, 'getOwnedBadges').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.getOwnedBadges();
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.ownBadges.length).toEqual(mockOwnedBadges.length);
    expect(result.current.dataSearch.length).toEqual(mockOwnedBadges.length);
    expect(result.current.showingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.choosingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.hasNewBadge).toBeTruthy();
    expect(result.current.totalBadges).toEqual(mockOwnedBadges[0].badges.length + mockOwnedBadges[1].badges.length);
  });

  it('should get owned badges successfully with response is not defined', () => {
    const response = {
      code: 200,
      data: {},
    };

    const spyCallApi = jest.spyOn(groupApi, 'getOwnedBadges').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.getOwnedBadges();
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.ownBadges.length).toEqual(0);
    expect(result.current.dataSearch.length).toEqual(0);
    expect(result.current.showingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.choosingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.hasNewBadge).toBeFalsy();
    expect(result.current.totalBadges).toEqual(0);
  });

  it('should get owned badges throw error', () => {
    const error = 'internal error';

    const spyCallApi = jest.spyOn(groupApi, 'getOwnedBadges').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));

    act(() => {
      try {
        result.current.actions.getOwnedBadges();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.loading).toBeTruthy();

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
  });
});
