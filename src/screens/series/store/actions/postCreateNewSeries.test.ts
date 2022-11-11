import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import { mockSeries, mockSeriesRequest } from '~/test/mock_data/series';
import { act, renderHook } from '~/test/testUtils';
import useSeriesStore, { ISeriesState } from '../index';

describe('postCreateNewSeries', () => {
  it('should post new series success:', () => {
    const response = {
      code: 200,
      data: mockSeries,
      meta: {},
    };
    const newsFeedMockResponse = {
      code: 200,
      data: [],
      meta: {},
    };
    const spyApiCreateNewSeries = jest.spyOn(streamApi, 'postCreateNewSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyApiGetSeriesDetail = jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyApiRefreshNewsFeed = jest.spyOn(streamApi, 'getNewsfeed').mockImplementation(
      () => Promise.resolve(newsFeedMockResponse) as any,
    );

    // Can not mock router helper b.c this func is outside of test func
    // const replace = jest.fn();
    // const navigation = {
    //   replace,
    // };
    // jest.spyOn(routerHelper, 'withNavigation').mockImplementation(() =>  navigation as any);

    useSeriesStore.setState((state: ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));
    act(() => {
      result.current.actions.postCreateNewSeries();
    });

    expect(result.current.loading).toBe(true);
    expect(spyApiCreateNewSeries).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSeriesDetail).toBeCalled();
    expect(result.current.loading).toBe(false);
    // expect(replace).toBeCalledWith(seriesStack.seriesDetail, { seriesId: mockSeries.id });
    expect(spyApiRefreshNewsFeed).toBeCalled();
  });

  it('should post new series throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'postCreateNewSeries').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    useSeriesStore.setState((state:ISeriesState) => {
      state.data = mockSeriesRequest as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useSeriesStore((state) => state));

    act(() => {
      try {
        result.current.actions.postCreateNewSeries();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(spyModalActions).toBeCalled();
  });
});
