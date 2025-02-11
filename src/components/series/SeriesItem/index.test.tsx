import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import usePostsStore from '~/store/entities/posts';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesItem from '.';
import { mockSeries } from '~/test/mock_data/series';

describe('SeriesItem component', () => {
  it('renders correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesItem data={mockSeries} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('header should be pressable', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesItem data={mockSeries} />);
    const header = wrapper.getByTestId('content_header');
    fireEvent.press(header);
  });

  it('renders delete item when series deleted', () => {
    const data = { ...mockSeries, deleted: true };
    const wrapper = renderWithRedux(<SeriesItem data={data} />);

    const deleteComponent = wrapper.getByTestId('series.delete_item');
    expect(deleteComponent).toBeDefined();
  });
});
