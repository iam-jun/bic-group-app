/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import streamApi from '~/api/StreamApi';
import { PostStatus } from '~/interfaces/IPost';
import { mockEditPost, mockMediaVideos } from '~/test/mock_data/post';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useCreatePostStore from '../store';
import useCreatePost from './useCreatePost';

describe('useCreatePost hook', () => {
  it('should autosave if edit draft post', async () => {
    const post = {
      data: {
        ...mockEditPost,
        status: PostStatus.DRAFT,
      },
    };
    const postEdited = {
      data: {
        ...mockEditPost,
        status: PostStatus.DRAFT,
        content: 'Edited',
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    jest
      .spyOn(streamApi, 'putAutoSavePost')
      .mockImplementation(() => Promise.resolve() as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));
    const { result: resultCreatePost } = renderHook(() => useCreatePost({
      screenParams: { postId: mockEditPost.id },
    }));

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    act(() => {
      resultCreatePost.current.handleChangeContent('Edited');
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.content).toBe('Edited');
    });

    await waitFor(() => {
      expect(resultCreatePost.current.isShowToastAutoSave).toBe(true);
    });
  });

  it('should update video if uploading is success', async () => {
    const post = {
      data: {
        ...mockEditPost,
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));
    const { result: resultCreatePost } = renderHook(() => useCreatePost({
      screenParams: { postId: mockEditPost.id },
    }));

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    act(() => {
      resultCreatePost.current.handleUploadVideoSuccess(mockMediaVideos[0]);
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.video).toBeDefined();
    });
  });

  it('should update file if uploading is success', async () => {
    const post = {
      data: {
        ...mockEditPost,
        media: {
          ...mockEditPost.media,
          files: [
            {
              name: 'abc.zip',
            },
          ],
        },
      },
    };
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve(post) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));
    const { result: resultCreatePost } = renderHook(() => useCreatePost({
      screenParams: { postId: mockEditPost.id },
    }));

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.isInitDone).toBeTruthy();
    });

    act(() => {
      resultCreatePost.current.handleUploadFileSuccess({
        id: '123',
        name: 'abc.zip',
      });
    });

    await waitFor(() => {
      expect(resultCreatePostStore.current.createPost.files[0].id).toBe('123');
    });
  });
});
