import streamApi from '~/api/StreamApi';
import { IPayloadPutEditPost, PostStatus } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import { act, renderHook, waitFor } from '~/test/testUtils';
import usePostsStore, { IPostsState } from '../index';
import { postCreatePost, responsePutEditPost } from '../__mocks__/data';
import APIErrorCode from '~/constants/apiErrorCode';
import useValidateSeriesTagsStore from '~/components/ValidateSeriesTags/store';

describe('putEditPost', () => {
  it('should not Id', () => {
    const payload: IPayloadPutEditPost = {
      id: null,
      data: null,
    };

    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));
    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(error).toBeCalled();
  });

  it('should auto save post', () => {
    const payload: IPayloadPutEditPost = {
      id: responsePutEditPost.data.id,
      data: postCreatePost as any,
      isPublish: false,
    };
    const spyApiPutAutoSavePost = jest.spyOn(streamApi, 'putAutoSavePost').mockImplementation(() => Promise.resolve() as any);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(spyApiPutAutoSavePost).toBeCalled();
  });

  it('should call onError when publishing post doesnt have response', async () => {
    const payload: IPayloadPutEditPost = {
      id: responsePutEditPost.data.id,
      data: postCreatePost as any,
      isPublish: true,
      onError: jest.fn(),
    };
    const spyApiPutPublishPost = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(() => Promise.resolve() as any);
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(spyApiPutPublishPost).toBeCalled();
    await waitFor(() => {
      expect(payload.onError).toBeCalled();
    });
  });

  it('should publishing post success but post is in processing', async () => {
    const res = { ...responsePutEditPost };
    res.data.status = PostStatus.PROCESSING;
    const payload: IPayloadPutEditPost = {
      id: responsePutEditPost.data.id,
      data: postCreatePost as any,
      isPublish: true,
      isRefresh: true,
      createFromGroupId: '123',
      msgSuccess: 'success',
    };
    const spyApiPutPublishPost = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(() => Promise.resolve(res) as any);
    jest.spyOn(streamApi, 'getDraftContents').mockImplementation(() => Promise.resolve() as any);
    jest.spyOn(streamApi, 'getGroupPosts').mockImplementation(() => Promise.resolve({}) as any);

    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(spyApiPutPublishPost).toBeCalled();
    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBe('post:draft:text_processing_publish');
    });
  });

  it('should publish post failed and call handleSeriesTagsError', async () => {
    const payload: IPayloadPutEditPost = {
      id: responsePutEditPost.data.id,
      data: postCreatePost as any,
      isPublish: true,
      onError: jest.fn(),
      isHandleSeriesTagsError: true,
    };
    const mockActionValidateSeriesTags = {
      actions: {
        handleSeriesTagsError: jest.fn(),
      },
    };
    const spyApiPutPublishPost = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(() => Promise.reject({ code: APIErrorCode.Post.POST_INVALID_PARAM }) as any);
    jest.spyOn(useValidateSeriesTagsStore, 'getState').mockImplementation(() => mockActionValidateSeriesTags as any);
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(spyApiPutPublishPost).toBeCalled();
    await waitFor(() => {
      expect(mockActionValidateSeriesTags.actions.handleSeriesTagsError).toBeCalled();
    });
  });

  it('should publish post failed and show toast error', async () => {
    const payload: IPayloadPutEditPost = {
      id: responsePutEditPost.data.id,
      data: postCreatePost as any,
      isPublish: true,
      onError: jest.fn(),
      onRetry: jest.fn(),
      msgError: 'error',
    };
    const spyApiPutPublishPost = jest.spyOn(streamApi, 'putPublishPost').mockImplementation(() => Promise.reject({ code: 'error' }) as any);
    const { result } = renderHook(() => usePostsStore((state: IPostsState) => state));

    act(() => {
      result.current.actions.putEditPost(payload);
    });

    expect(spyApiPutPublishPost).toBeCalled();
    await waitFor(() => {
      expect(useModalStore.getState().toast?.content).toBe('error');
    });
  });
});
