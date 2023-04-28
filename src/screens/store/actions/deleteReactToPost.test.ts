import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import { POST_DETAIL } from '~/test/mock_data/post';
import usePostsStore from '~/store/entities/posts';

describe('delete react to post', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call API success to delete react to post', () => {
    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
      () => Promise.resolve({}),
    );

    usePostsStore.setState((state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.posts = {
        [POST_DETAIL.id]: POST_DETAIL,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.deleteReactToPost({
        id: POST_DETAIL.id,
        reactionId: 'wink',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ownReaction: POST_DETAIL.ownerReactions,
        reactionsCount: POST_DETAIL.reactionsCount,
      });
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });

  it('should do NOTHING since the reaction does not exist', () => {
    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
      () => Promise.resolve({}),
    );

    usePostsStore.setState((state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.posts = {
        [POST_DETAIL.id]: POST_DETAIL,
      };
      return state;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.deleteReactToPost({
        id: POST_DETAIL.id,
        reactionId: 'bic_flying_rocket',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ownReaction: POST_DETAIL.ownerReactions,
        reactionsCount: POST_DETAIL.reactionsCount,
      });
    });

    expect(spy).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).not.toBeCalled();
  });

  it('should call API delete and throws an error', () => {
    const error = {
      meta: {
        message: 'This is an error.',
      },
    };

    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
      () => Promise.reject(error),
    );

    usePostsStore.setState((state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.posts = {
        [POST_DETAIL.id]: POST_DETAIL,
      };
      return state;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      try {
        result.current.actions.deleteReactToPost({
          id: POST_DETAIL.id,
          reactionId: 'wink',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ownReaction: POST_DETAIL.ownerReactions,
          reactionsCount: POST_DETAIL.reactionsCount,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      type: 'error',
      content: error.meta.message,
    });
  });
});
