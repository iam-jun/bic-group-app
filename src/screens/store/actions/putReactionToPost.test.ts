import usePostsStore from '~/store/entities/posts';
import { POST_DETAIL } from '~/test/mock_data/post';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';

describe('putReactionToPost', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should do NOTHING when the reaction is already added', () => {
    const spy = jest.spyOn(streamApi, 'putReaction').mockImplementation(
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
      result.current.actions.putReactionToPost({
        id: POST_DETAIL.id,
        reactionId: 'wink',
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
  });

  it('should add new reaction success', () => {
    const response = {
      data: {
        actor: {},
        id: 'c9656d6a-2435-4baf-ae7e-f64171680155',
        reaction_name: 'bic_flying_rocket',
      },
    };

    const spy = jest.spyOn(streamApi, 'putReaction').mockImplementation(
      () => Promise.resolve(response),
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
      result.current.actions.putReactionToPost({
        id: POST_DETAIL.id,
        reactionId: 'bic_flying_rocket',
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

  it('should call API delete and throws an error', () => {
    const error = {
      meta: {
        message: 'This is an error.',
      },
    };

    const spy = jest.spyOn(streamApi, 'putReaction').mockImplementation(
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
        result.current.actions.putReactionToPost({
          id: POST_DETAIL.id,
          reactionId: 'bic_flying_rocket',
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
