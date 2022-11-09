import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import usePostsStore from '~/store/entities/posts';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesItem from '.';
import { mockSeries } from '~/test/mock_data/series';

describe('SeriesItem component', () => {
  const seriesId = '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8';
  it('renders correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesItem id={seriesId} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('header should be pressable', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesItem id={seriesId} />);
    const header = wrapper.getByTestId('content_header');
    fireEvent.press(header);
  });

  it('renders delete item when series deleted', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: { ...mockSeries, deleted: true } });
    });

    const wrapper = renderWithRedux(<SeriesItem id={seriesId} />);
    expect(wrapper.toJSON()).toMatchSnapshot();

    const deleteComponent = wrapper.getByTestId('series.delete_item');
    expect(deleteComponent).toBeDefined();
  });
});
