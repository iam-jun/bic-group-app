import { act, renderHook } from '~/test/testUtils';
import usePostsInProgressStore, { IPostsInProgressState } from '../index';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useHomeStore from '~/screens/Home/store';
import IHomeState from '~/screens/Home/store/Interface';

describe('updatePostsInProgress', () => {
  it('should updatePostsInProgress correctly', () => {
    const mockPayload = {
      activities: [
        {
          id: '1',
        },
      ],
      extra: { type: NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL },
    };

    usePostsInProgressStore.setState((state: IPostsInProgressState) => {
      state.total = 1;
      state.data = [{ id: '1' }];
      return state;
    });

    const setDataFeed = jest.fn();
    useHomeStore.setState((state: IHomeState) => {
      state.actions.setDataFeed = setDataFeed;
      state.feed.ALL.ALL.data = ['2'];
      return state;
    });

    const { result } = renderHook(() => usePostsInProgressStore((state) => state));
    act(() => {
      result.current.actions.updatePosts(mockPayload);
    });

    expect(setDataFeed).toBeCalled();
  });
});
