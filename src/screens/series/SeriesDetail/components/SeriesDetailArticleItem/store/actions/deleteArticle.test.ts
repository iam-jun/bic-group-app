import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import { listArticle, mockSeries } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesDetailArticleItemStore from '../index';

describe('deleteArticleInSeries', () => {
  it('should do nothing if id undefined', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyApiDeleteArticle = jest.spyOn(streamApi, 'removeArticleFromSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));
    act(() => {
      result.current.actions.deleteArticle('', '');
    });

    expect(spyApiDeleteArticle).not.toBeCalled();
  });

  it('should delete aritcle success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const getSeriesDetailResponse = {
      code: 200,
      data: mockSeries,
      meta: {},
    };
    const spyApiDeleteArticle = jest.spyOn(streamApi, 'removeArticleFromSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyApiGetSeriesDetail = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(getSeriesDetailResponse) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));
    act(() => {
      result.current.actions.deleteArticle(mockSeries.id, listArticle[0].id);
    });

    expect(spyApiDeleteArticle).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSeriesDetail).toBeCalled();
    expect(spyModalActions).toBeCalledWith({ content: 'series:text_article_removed' });
  });

  it('should delete aritcle throw error and should show toast', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'removeArticleFromSeriesDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));

    act(() => {
      try {
        result.current.actions.deleteArticle(mockSeries.id, listArticle[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalled();
  });

  // afterEach(() => {
  //   jest.runOnlyPendingTimers(); // you must add this
  //   jest.useRealTimers(); // you must add this
  // });
});
