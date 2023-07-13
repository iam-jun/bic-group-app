import { act, renderHook } from '~/test/testUtils';
import useUserBadge, { IUserBadgesState } from '../index';
import { mockBadges } from '~/test/mock_data/userProfile';
import groupApi from '~/api/GroupApi';

describe('markNewBadge function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should delete new badge successfully', () => {
    useUserBadge.setState((state: IUserBadgesState) => {
      state.badges = mockBadges;
      return state;
    });

    const id = 'a8cbf951-a51e-49ea-9aa5-1c1c39142b3e';
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
      result.current.actions.markNewBadge(id);
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.badges[id]?.isNew).toBeFalsy();
  });

  it('should do nothing if badge is not new', () => {
    const id = '0987';
    useUserBadge.setState((state: IUserBadgesState) => {
      state.badges = {
        '0987': {
          id,
          isNew: false,
        },
      };
      return state;
    });

    const spyCallApi = jest.spyOn(groupApi, 'markNewBadge').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.markNewBadge(id);
    });

    expect(spyCallApi).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.badges[id]?.isNew).toBeFalsy();
  });

  it('should delete new badge throw error', () => {
    const error = 'internal error';
    useUserBadge.setState((state: IUserBadgesState) => {
      state.badges = mockBadges;
      return state;
    });

    const id = 'a8cbf951-a51e-49ea-9aa5-1c1c39142b3e';
    const spyCallApi = jest.spyOn(groupApi, 'markNewBadge').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));

    act(() => {
      try {
        result.current.actions.markNewBadge(id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.badges[id]?.isNew).toBeTruthy();
  });
});
