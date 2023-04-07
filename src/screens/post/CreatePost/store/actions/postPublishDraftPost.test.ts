import groupApi from '~/api/GroupApi';
import streamApi from '~/api/StreamApi';
import { PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';
import useTimelineStore from '~/store/timeline';
import { mockEditPost } from '~/test/mock_data/post';
import { responseTimeline } from '~/test/mock_data/timeline';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useCreatePostStore from '../index';

describe('postPublishDraftPost action', () => {
  it('should publish draft post successfully', async () => {
    const publishPost = {
      data: {
        ...mockEditPost,
      },
    };
    jest
      .spyOn(streamApi, 'postPublishDraftPost')
      .mockImplementation(() => Promise.resolve(publishPost) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));
    const { result: resultPostsStore } = renderHook(() => usePostsStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.postPublishDraftPost({
        draftPostId: mockEditPost.id,
        replaceWithDetail: true,
      });
    });

    await waitFor(() => {
      expect(resultPostsStore.current.posts[mockEditPost.id]).toBeDefined();
    });
  });

  it('should call error function if publishing draft post is failed', async () => {
    const mockOnError = jest.fn();
    const publishPost = {
    };
    jest
      .spyOn(streamApi, 'postPublishDraftPost')
      .mockImplementation(() => Promise.resolve(publishPost) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.postPublishDraftPost({
        draftPostId: mockEditPost.id,
        onError: mockOnError,
      });
    });

    await waitFor(() => {
      expect(mockOnError).toBeCalled();
    });
  });

  it('should get group post if publishing draft post with createFromGroupId', async () => {
    const publishPost = {
      data: {
        ...mockEditPost,
      },
    };
    jest
      .spyOn(streamApi, 'postPublishDraftPost')
      .mockImplementation(() => Promise.resolve(publishPost) as any);
    jest.spyOn(groupApi, 'getGroupPosts').mockImplementation(
      () => Promise.resolve(responseTimeline) as any,
    );
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));
    const { result: resultTimelineStore } = renderHook(() => useTimelineStore((state) => state));
    const { result: resultPostsStore } = renderHook(() => usePostsStore((state) => state));

    act(() => {
      resultTimelineStore.current.actions.initDataTimeline('123');
    });

    act(() => {
      resultCreatePostStore.current.actions.postPublishDraftPost({
        draftPostId: mockEditPost.id,
        createFromGroupId: '123',
      });
    });

    await waitFor(() => {
      expect(resultPostsStore.current.posts[mockEditPost.id]).toBeDefined();

      const { data } = resultTimelineStore.current.timelines['123'];
      expect(data.ALL.ALL.ids.length).toBe(responseTimeline.data.list.length);
    });
  });

  it('should show toast if publishing draft post is in processing', async () => {
    const publishPost = {
      data: {
        ...mockEditPost,
        status: PostStatus.PROCESSING,
      },
    };
    jest
      .spyOn(streamApi, 'postPublishDraftPost')
      .mockImplementation(() => Promise.resolve(publishPost) as any);
    const { result: resultCreatePostStore } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      resultCreatePostStore.current.actions.postPublishDraftPost({
        draftPostId: mockEditPost.id,
      });
    });

    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBeDefined();
    });
  });
});
