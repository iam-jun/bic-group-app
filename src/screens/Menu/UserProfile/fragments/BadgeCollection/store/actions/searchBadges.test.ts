import { act, renderHook } from '~/test/testUtils';
import useUserBadge, { IUserBadgesState } from '../index';
import { mockOwnedBadges } from '~/test/mock_data/userProfile';

describe('searchBadges function', () => {
//   afterEach(() => {
//     jest.runOnlyPendingTimers(); // you must add this
//     jest.useRealTimers(); // you must add this
//   });

  it('should search resolve result successfully with empty query', async () => {
    useUserBadge.setState((state: IUserBadgesState) => {
      state.dataSearch = mockOwnedBadges;
      state.ownBadges = mockOwnedBadges;
      state.loadingSearch = false;
      return state;
    });

    const { result } = renderHook(() => useUserBadge((state) => state));
    expect(result.current.loadingSearch).toBeFalsy();

    act(() => {
      result.current.actions.searchBadges('');
    });

    expect(result.current.dataSearch.length).toEqual(mockOwnedBadges.length);
  });

  it('should search resolve result successfully with query not empty', () => {
    useUserBadge.setState((state: IUserBadgesState) => {
      state.dataSearch = mockOwnedBadges;
      state.ownBadges = mockOwnedBadges;
      return state;
    });

    const { result } = renderHook(() => useUserBadge((state) => state));
    expect(result.current.loadingSearch).toBeFalsy();

    act(() => {
      result.current.actions.searchBadges('Name ne');
    });

    expect(result.current.loadingSearch).toBeFalsy();
    expect(result.current.dataSearch.length).toEqual(1);
  });

  it('should return nothing if badge in community is empty', () => {
    const mockData = [{
      id: '3d06a315-d416-4ef2-aa7b-3caa14847b3f',
      name: 'Joy Plain',
      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
      isNew: true,
      badges: [],
    }];

    useUserBadge.setState((state: IUserBadgesState) => {
      state.dataSearch = mockData;
      state.ownBadges = mockData;
      return state;
    });

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.searchBadges('Name ne');
    });
    expect(result.current.loadingSearch).toBeFalsy();
    expect(result.current.dataSearch.length).toEqual(0);
  });

  it('should delete new badge of community and throw error', () => {
    const mockData = [{
      id: '3d06a315-d416-4ef2-aa7b-3caa14847b3f',
      name: 'Joy Plain',
      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
      isNew: true,
      badges: [
        {
          id: 'a8cbf951-a51e-49ea-9aa5-1c1c39142b3e',
          name: undefined,
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
        },
      ],
    }];

    useUserBadge.setState((state: IUserBadgesState) => {
      state.dataSearch = mockData;
      state.ownBadges = mockData;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));

    act(() => {
      try {
        result.current.actions.searchBadges('Name ne');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    expect(result.current.loadingSearch).toBeFalsy();
    expect(result.current.dataSearch.length).toEqual(mockData.length);
  });
});
