import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import { mockListSeriesOfArticle, searchSeriesRequestParams } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useEditArticleSeriesStore from '../index';

describe('searchSeries in article', () => {
  it('should search list series success:', () => {
    const response = {
      code: 200,
      data: {
        list: mockListSeriesOfArticle,
        meta: {
          total: mockListSeriesOfArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useEditArticleSeriesStore((state) => state));
    act(() => {
      result.current.actions.searchSeries({ ...searchSeriesRequestParams, contentSearch: 'test' });
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiSearchSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.items).toBe(mockListSeriesOfArticle);
  });

  it('should get series success but respone list data is undefined and should show toast', () => {
    const response = {
      code: 200,
      data: {
        list: undefined,
        meta: {
          total: 0,
          offset: 0,
        },
      },
      meta: {},
    };

    const spyApiSearchSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useEditArticleSeriesStore((state) => state));

    act(() => {
      result.current.actions.searchSeries({ ...searchSeriesRequestParams, contentSearch: 'test' });
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiSearchSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(spyModalActions).toBeCalled();
  });

  it('should search series throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiSearchSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useEditArticleSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.searchSeries({ ...searchSeriesRequestParams, contentSearch: 'test' });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.search.loading).toBe(true);
    expect(result.current.search.key).toBe('test');
    expect(spyApiSearchSeriesByAudiences).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(spyModalActions).toBeCalled();
  });

//   afterEach(() => {
//     jest.runOnlyPendingTimers(); // you must add this
//     jest.useRealTimers(); // you must add this
//   });
});
