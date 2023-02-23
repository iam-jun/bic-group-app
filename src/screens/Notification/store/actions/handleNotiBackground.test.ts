import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useNotificationStore from '../index';
import { act, renderHook } from '~/test/testUtils';
import usePostsContainingVideoInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import { parseSafe } from '~/utils/common';

describe('handleNotiBackground function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if remoteMessage has not newExtraData', () => {
    const fakeRemoteMessage = { };
    const updatePosts = jest.fn();
    const actions = { updatePosts };
    jest.spyOn(usePostsContainingVideoInProgressStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.handleNotiBackground(fakeRemoteMessage);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(updatePosts).not.toBeCalled();
  });

  it('should do nothing if emoteMessage has newExtraData but type not require', () => {
    const fakeRemoteMessage = { data: { extraData: { type: 'test' } } };
    const updatePosts = jest.fn();
    const actions = { updatePosts };
    jest.spyOn(usePostsContainingVideoInProgressStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.handleNotiBackground(fakeRemoteMessage);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(updatePosts).not.toBeCalled();
  });

  it('should call action updatePosts if emoteMessage has newExtraData and type is video successfully', () => {
    const extraData = JSON.stringify({ type: NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL });
    const fakeRemoteMessage = { data: { extraData } };

    const updatePosts = jest.fn();
    const actions = { updatePosts };
    jest.spyOn(usePostsContainingVideoInProgressStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.handleNotiBackground(fakeRemoteMessage);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(updatePosts).toBeCalledWith(parseSafe(extraData));
  });

  it('should call action updatePosts if emoteMessage has newExtraData and type is video unsuccessfully', () => {
    const extraData = JSON.stringify({ type: NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL });
    const fakeRemoteMessage = { data: { extraData } };

    const updatePosts = jest.fn();
    const actions = { updatePosts };
    jest.spyOn(usePostsContainingVideoInProgressStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.handleNotiBackground(fakeRemoteMessage);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(updatePosts).toBeCalledWith(parseSafe(extraData));
  });
});
