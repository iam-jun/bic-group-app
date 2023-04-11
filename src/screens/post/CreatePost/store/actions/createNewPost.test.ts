import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { mockDraftPost } from '~/test/mock_data/draftPosts';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useCreatePostStore from '../index';

describe('createNewPost action', () => {
  it('should create new post successfully', async () => {
    const createPost = {
      data: {
        ...mockDraftPost,
      },
    };
    jest
      .spyOn(streamApi, 'postCreateNewPost')
      .mockImplementation(() => Promise.resolve(createPost) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.createNewPost({});
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.id).toBe(mockDraftPost.id);
    });
  });

  it('should create new post failed', async () => {
    jest
      .spyOn(streamApi, 'postCreateNewPost')
      .mockImplementation(() => Promise.reject({}) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.createNewPost({});
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBeTruthy();
    });
  });
});
