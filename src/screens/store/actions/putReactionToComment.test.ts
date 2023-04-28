import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import streamApi from '~/api/StreamApi';
import useCommentsStore from '~/store/entities/comments';
import { mockComment } from '~/test/mock_data/comment';
import useModalStore from '~/store/modal';

describe('putReactionToComment', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should do NOTHING when the reaction is already added', () => {
    const spy = jest.spyOn(streamApi, 'putReaction').mockImplementation(
      () => Promise.resolve({}),
    );

    useCommentsStore.setState((state) => {
      state.comments = {
        [mockComment.id]: mockComment,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.putReactionToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_flying_rocket',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
      });
    });

    expect(spy).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });

  it('should add reaction to comment success', () => {
    const response = {
      data: {
        actor: {},
        id: 'c9656d6a-2435-4baf-ae7e-f64171680155',
        reaction_name: 'bic_clapping_hand',
      },
    };

    const spy = jest.spyOn(streamApi, 'putReaction').mockImplementation(
      () => Promise.resolve(response),
    );

    useCommentsStore.setState((state) => {
      state.comments = {
        [mockComment.id]: mockComment,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.putReactionToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_clapping_hand',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
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

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    useCommentsStore.setState((state) => {
      state.comments = {
        [mockComment.id]: mockComment,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    try {
      result.current.actions.putReactionToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_clapping_hand',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(error).toBe(error);
    }

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
