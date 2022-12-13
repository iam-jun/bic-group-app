import { POST_DETAIL } from '~/test/mock_data/post';
import streamApi from '~/api/StreamApi';
import { renderHook, act } from '~/test/testUtils';
import useArticleController from '../index';
import modalActions from '~/storeRedux/modal/actions';

describe('deleteArticle', () => {
  const id = '1';
  const isDraft = true;

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

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle({ id, isDraft });
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

    const spyShowHideToastMessage = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle({ isDraft } as any);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyDeleteArticle).not.toBeCalled();
    expect(spyShowHideToastMessage).not.toBeCalled();
  });

  it('should call API and throws error', () => {
    const error = 'internal error';

    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyShowHideToastMessage = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      try {
        result.current.actions.deleteArticle({ id, isDraft });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spyDeleteArticle).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowHideToastMessage).toBeCalled();
  });

  it('should call API to delete draft article success but no data is return', () => {
    const spyDeleteArticle = jest.spyOn(streamApi, 'deleteArticle').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const spyGetDraftArticles = jest.spyOn(streamApi, 'getDraftArticles').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useArticleController((state) => state));
    act(() => {
      result.current.actions.deleteArticle({ id, isDraft });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyDeleteArticle).toBeCalled();
    expect(spyGetDraftArticles).not.toBeCalled();
  });
});
