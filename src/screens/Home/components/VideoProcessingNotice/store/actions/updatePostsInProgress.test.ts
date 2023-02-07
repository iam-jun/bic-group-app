import { act, renderHook } from '~/test/testUtils';
import usePostsInProgressStore, { IPostsInProgressState } from '../index';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useHomeStore from '~/screens/Home/store';
import usePostsStore from '~/store/entities/posts';
import IHomeState from '~/screens/Home/store/Interface';

describe('updatePostsInProgress', () => {
  const mockPayload = {
    activities: [{
      id: 'id 1',
    }],
    extra: { type: NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL },
  };
  it('should do nothing if payload has no postId', () => {
    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: 'id 1' }];
      return state;
    });
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.updatePosts({});
    });

    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);
  });

  it('should update store when payload has post id', () => {
    const addToPosts = jest.fn();
    const postActions = {
      addToPosts,
    };
    const setDataFeed = jest.fn();
    const homeActions = {
      setDataFeed,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions: postActions } as any));
    jest.spyOn(useHomeStore, 'getState').mockImplementation(() => ({ actions: homeActions } as any));

    useHomeStore.setState((state: IHomeState) => {
      state.feed.ALL.ALL.data = [];
      return state;
    });

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: 'id 1' }];
      return state;
    });
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);

    act(() => {
      result.current.actions.updatePosts(mockPayload);
    });

    expect(result.current.total).toBe(0);
    expect(result.current.data.length).toBe(0);
  });

  it('should update store when payload has post id with type post video success', () => {
    const payload = {
      activities: [{
        id: 'id 1',
      }],
      extra: { type: NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL },
    };
    const addToPosts = jest.fn();
    const postActions = {
      addToPosts,
    };
    const setDataFeed = jest.fn();
    const homeActions = {
      setDataFeed,
    };
    jest.spyOn(usePostsStore, 'getState').mockImplementation(() => ({ actions: postActions } as any));
    jest.spyOn(useHomeStore, 'getState').mockImplementation(() => ({ actions: homeActions } as any));

    useHomeStore.setState((state: IHomeState) => {
      state.feed.ALL.ALL.data = [];
      return state;
    });

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: 'id 1' }];
      return state;
    });
    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    expect(result.current.total).toBe(1);
    expect(result.current.data.length).toBe(1);

    act(() => {
      result.current.actions.updatePosts(payload);
    });

    expect(result.current.total).toBe(0);
    expect(result.current.data.length).toBe(0);
  });
});
