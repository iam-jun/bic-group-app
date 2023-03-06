import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import useModalStore from '~/store/modal';
import { mockSeries } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesDetail from '.';

describe('SeriesDetail component', () => {
  const seriesId = '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesDetail route={{ params: { seriesId } }} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
  it('renders delete item when series deleted', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: { ...mockSeries, deleted: true } });
    });

    const wrapper = renderWithRedux(<SeriesDetail route={{ params: { seriesId } }} />);
    expect(wrapper.toJSON()).toMatchSnapshot();

    const deleteComponent = wrapper.getByTestId('series.delete_item');
    expect(deleteComponent).toBeDefined();
  });

  it('should call action show bottom list menu when press menu icon', () => {
    const showBottomList = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showBottomList } as any;
      return state;
    });

    const response = {
      code: 200,
      data: mockSeries,
      meta: {},
    };
    jest.spyOn(streamApi, 'getSeriesDetail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesDetail route={{ params: { seriesId } }} />);

    act(() => {
      jest.runAllTimers();
    });

    const iconMenu = wrapper.getByTestId('header.rightIcon.button');
    expect(iconMenu).toBeDefined();
    fireEvent.press(iconMenu);

    expect(showBottomList).toBeCalled();
  });
});
