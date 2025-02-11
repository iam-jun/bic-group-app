import { POST_DETAIL } from '~/test/mock_data/post';
import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useArticleController from '../index';
import useModalStore from '~/store/modal';

describe('deleteArticle', () => {
  const id = '1';

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call API to delete draft article success', () => {
    const response = {
      data: {
        ...POST_DETAIL,
        isProcessing: false,
      },
    };

    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle(id);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyDeleteArticle).toBeCalled();
    expect(spyGetDraftArticles).toBeCalled();
  });

  it('should not run because id is not available', () => {
    const response = {
      data: {
        ...POST_DETAIL,
        isProcessing: false,
      },
    };

    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle('');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyDeleteArticle).not.toBeCalled();
    expect(showToast).not.toBeCalled();
  });

  it('should call API and throws error', () => {
    const error = 'internal error';

    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      try {
        result.current.actions.deleteArticle(id);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spyDeleteArticle).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });

  it('should call API to delete draft article success but no data is return', () => {
    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftContents').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle(id);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyDeleteArticle).toBeCalled();
    expect(spyGetDraftArticles).not.toBeCalled();
  });
});
