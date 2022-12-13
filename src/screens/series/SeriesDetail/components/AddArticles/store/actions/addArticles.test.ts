import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import { mockArticle } from '~/test/mock_data/article';
import { mockSeries } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useAddArticlesStore from '../index';

describe('addArticles in series', () => {
  const seriesId = mockSeries.id;
  const article = mockArticle;
  it('should search addArticles success', () => {
    const response = {
      code: 200,
      meta: {
        message: 'OK',
      },
    };

    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.addArticles(seriesId, article);
    });

    expect(JSON.stringify(result.current.selectingArticles)).toBe('{}');
    expect(spyApiAddArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const expectSelectingArticles = { [article.id]: { ...article } };

    expect(JSON.stringify(result.current.selectingArticles)).toBe(JSON.stringify(expectSelectingArticles));
    expect(spyModalActions).toBeCalledWith({ content: 'series:text_add_articles_success' });
  });

  it('should do nothing when seriesId is empty:', () => {
    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.addArticles('', article);
    });

    expect(spyApiAddArticles).not.toBeCalled();
  });

  it('should do nothing when article is undefine:', () => {
    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const { result } = renderHook(() => useAddArticlesStore((state) => state));
    act(() => {
      result.current.actions.addArticles(seriesId, undefined);
    });

    expect(spyApiAddArticles).not.toBeCalled();
  });

  it('should add article throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiAddArticles = jest.spyOn(streamApi, 'addArticleInSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useAddArticlesStore((state) => state));

    act(() => {
      try {
        result.current.actions.addArticles(seriesId, article);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spyApiAddArticles).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
