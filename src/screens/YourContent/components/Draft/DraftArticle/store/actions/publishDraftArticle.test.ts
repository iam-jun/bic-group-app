import { renderHook, act } from '~/test/testUtils';
import streamApi from '~/api/StreamApi';
import useDraftArticleStore from '../index';
import { POST_DETAIL } from '~/test/mock_data/post';
import useModalStore from '~/store/modal';
import { PostStatus } from '~/interfaces/IPost';

describe('publishDraftArticle', () => {
  const draftArticleId = '1';
  const onSuccess = jest.fn();
  const onError = jest.fn();

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call API success but no data returns', () => {
    const response = {};
    const spy = jest.spyOn(streamApi, 'publishDraftArticle').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    result.current.actions.publishDraftArticle({
      draftArticleId,
      onSuccess,
      onError,
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(onError).toBeCalled();
  });

  it('should call API success, isProcessing = false and replaceWithDetail = false', () => {
    const response = {
      data: {
        ...POST_DETAIL,
        isProcessing: false,
      },
    };
    const spy = jest.spyOn(streamApi, 'publishDraftArticle').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    result.current.actions.publishDraftArticle({
      draftArticleId,
      onSuccess,
      onError,
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(onSuccess).toBeCalled();
    expect(spyGetDraftArticles).toBeCalled();
  });

  it('should call API success and status = \'PROCESSING\'', () => {
    const response = {
      data: {
        ...POST_DETAIL,
        status: PostStatus.PROCESSING,
      },
    };
    const spyPublishDraftArticle = jest.spyOn(streamApi, 'publishDraftArticle').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const spyGetAllPostContainingVideoInProgress = jest.spyOn(streamApi, 'getDraftContents');

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));

    result.current.actions.publishDraftArticle({
      draftArticleId,
      onSuccess,
      onError,
    });
    expect(spyPublishDraftArticle).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(onSuccess).toBeCalled();
    expect(showToast).toBeCalled();
    expect(spyGetAllPostContainingVideoInProgress).toBeCalled();
    expect(spyGetDraftArticles).toBeCalled();
  });

  it('should call API and throws error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'publishDraftArticle').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useDraftArticleStore((state) => state));
    act(() => {
      try {
        result.current.actions.publishDraftArticle({
          draftArticleId,
          onSuccess,
          onError,
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

    expect(onError).toBeCalled();
  });
});
