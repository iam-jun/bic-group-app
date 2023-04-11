import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useCommonController from '../index';
import { mockComment } from '~/test/mock_data/comment';
import useModalStore from '~/store/modal';
import useCommentsStore from '~/store/entities/comments';

describe('deleteReactToComment', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should delete an existing reaction to comment successfully', () => {
    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
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
      result.current.actions.deleteReactToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_flying_rocket',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
      });
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });

  it('should do NOTHING once deleting a non-existing reaction to a comment', () => {
    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
      () => Promise.resolve({}),
    );

    useCommentsStore.setState((state) => {
      state.comments = {
        [mockComment.id]: mockComment,
      };
      return state;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.deleteReactToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_clapping_hands',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
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

    useCommentsStore.setState((state) => {
      state.comments = {
        [mockComment.id]: mockComment,
      };
      return state;
    });

    const spy = jest.spyOn(streamApi, 'deleteReaction').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommonController((state) => state));
    act(() => {
      result.current.actions.deleteReactToComment({
        id: mockComment.id,
        comment: mockComment,
        postId: mockComment.postId,
        parentCommentId: mockComment.parentId,
        reactionId: 'bic_flying_rocket',
        ownerReactions: mockComment.ownerReactions,
        reactionsCount: mockComment.reactionsCount,
      });
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
