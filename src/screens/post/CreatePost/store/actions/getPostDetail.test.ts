import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { mockDraftPost } from '~/test/mock_data/draftPosts';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useCreatePostStore from '../index';

describe('getPostDetail action', () => {
  it('should getPostDetail successfully', async () => {
    const detailPost = {
      data: {
        ...mockDraftPost,
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(detailPost) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.getPostDetail(mockDraftPost.id);
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.isLoadPostDetailDone).toBeTruthy();
    });
  });

  it('should getPostDetail failed', async () => {
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.reject({}) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.getPostDetail(mockDraftPost.id);
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBeTruthy();
    });
  });
});
