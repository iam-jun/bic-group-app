import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import CreatePostSeries from '.';
import useCreatePostStore from '../CreatePost/store';
import streamApi from '~/api/StreamApi';
import MockedNavigator from '~/test/MockedNavigator';
import useCreatePost from '../CreatePost/hooks/useCreatePost';
import { mockListSeriesOfArticle } from '~/test/mock_data/series';
import useSelectSeriesStore from '~/components/SelectSeries/store';

describe('CreatePostSeries component', () => {
  it('should render list series by selected audience', async () => {
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
    const spyApiSearchSeries = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        chosenAudiences: [{ type: 'group', id: '123' }],
      });
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    expect(spyApiSearchSeries).toBeCalled();

    await waitFor(() => {
      const seriesItems = wrapper.getAllByTestId('series_item');
      expect(seriesItems.length).toEqual(mockListSeriesOfArticle.length);
    });
  });

  it('should load more', async () => {
    const response1 = {
      code: 200,
      data: {
        list: mockListSeriesOfArticle.slice(0, 1),
        meta: {
          total: mockListSeriesOfArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };
    const response2 = {
      code: 200,
      data: {
        list: mockListSeriesOfArticle.slice(1),
        meta: {
          total: mockListSeriesOfArticle.length,
          offset: 1,
        },
      },
      meta: {},
    };
    const spyApiSearchSeries = jest.spyOn(streamApi, 'searchSeries').mockReturnValueOnce(
        response1 as any,
    ).mockReturnValueOnce(response2 as any);
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        chosenAudiences: [{ type: 'group', id: '123' }],
      });
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    expect(spyApiSearchSeries).toBeCalled();

    await waitFor(() => {
      const seriesItems = wrapper.getAllByTestId('series_item');
      expect(seriesItems.length).toEqual(mockListSeriesOfArticle.slice(0, 1).length);
    });

    const listSeries = wrapper.getByTestId('list_series_with_audiences.list_series');

    act(() => {
      listSeries.props.onEndReached();
    });

    expect(spyApiSearchSeries).toBeCalled();

    await waitFor(() => {
      const seriesItems = wrapper.getAllByTestId('series_item');
      expect(seriesItems.length).toEqual(mockListSeriesOfArticle.length);
    });
  });

  it('should add item series when selecting a series', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      useSelectSeriesStore.setState((state) => ({
        ...state,
        listSeries: {
          ...state.listSeries,
          items: mockListSeriesOfArticle,
        },
      }));
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    const checkboxItems = wrapper.getAllByTestId('series_item.check_box');

    act(() => {
      fireEvent.press(checkboxItems[0]);
    });

    expect(result.current.tempData.series.length).toEqual(1);
  });

  it('should remove item series when unselecting a series', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    act(() => {
      result.current.actions.addSeriesToTempData(mockListSeriesOfArticle[0] as any);
      useSelectSeriesStore.setState((state) => ({
        ...state,
        listSeries: {
          ...state.listSeries,
          items: mockListSeriesOfArticle,
        },
      }));
    });

    const checkboxItems = wrapper.getAllByTestId('series_item.check_box');

    act(() => {
      fireEvent.press(checkboxItems[0]);
    });

    expect(result.current.tempData.series.length).toEqual(0);
  });

  it('should search series when typing a keyword', async () => {
    jest.useFakeTimers();

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
    const spyApiSearchSeries = jest.spyOn(streamApi, 'searchSeries').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useSelectSeriesStore((state) => state));

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    const searchInput = wrapper.getByTestId('search_input.input');

    act(() => {
      fireEvent.changeText(searchInput, 'abc');
      jest.advanceTimersByTime(200);
    });

    jest.useRealTimers();

    expect(spyApiSearchSeries).toBeCalled();

    await waitFor(() => {
      const seriesItems = wrapper.getAllByTestId('series_item');
      expect(seriesItems.length).toEqual(mockListSeriesOfArticle.length);

      expect(result.current.search.key).toEqual('abc');
      expect(result.current.search.loading).toEqual(false);
    });
  });

  it('should save selected series', async () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));
    const { result: createPost } = renderHook(() => useCreatePost());

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostSeries />} />);

    act(() => {
      result.current.actions.addSeriesToTempData(mockListSeriesOfArticle[0] as any);
    });

    expect(createPost.current.enableButtonSaveSeries).toBeTruthy();

    const btnSave = wrapper.getByTestId('header.button');

    act(() => {
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(result.current.createPost.series.length).toEqual(1);
    });
  });
});
