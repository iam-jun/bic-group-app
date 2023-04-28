import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { mockListSeriesOfArticle, searchSeriesRequestParams } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSelectSeriesStore from '../index';

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
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));
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

  it('should search series throw error and should show toast', () => {
    const error = 'internal error';
    const spyApiSearchSeriesByAudiences = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));

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
    expect(showToast).toBeCalled();
  });
});
