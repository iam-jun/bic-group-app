import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';
import { listArticle, mockSeries } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesDetailArticleItemStore from '../index';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('deleteItemFromSeriesDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if id undefined', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyApiDeleteArticle = jest.spyOn(streamApi, 'removeItemFromSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));
    act(() => {
      result.current.actions.deleteItemFromSeriesDetail('', '');
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
    const spyApiDeleteArticle = jest.spyOn(streamApi, 'removeItemFromSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyApiGetSeriesDetail = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(getSeriesDetailResponse) as any,
    );

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));
    act(() => {
      result.current.actions.deleteItemFromSeriesDetail(mockSeries.id, listArticle[0].id);
    });

    expect(spyApiDeleteArticle).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSeriesDetail).toBeCalled();
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should delete aritcle throw error and should show toast', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'removeItemFromSeriesDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesDetailArticleItemStore((state) => state));

    act(() => {
      try {
        result.current.actions.deleteItemFromSeriesDetail(mockSeries.id, listArticle[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });

  // afterEach(() => {
  //   jest.runOnlyPendingTimers(); // you must add this
  //   jest.useRealTimers(); // you must add this
  // });
});
