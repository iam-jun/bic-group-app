import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import usePostsStore from '~/store/entities/posts';
import { mockSeries } from '~/test/mock_data/series';
import { renderWithRedux } from '~/test/testUtils';
import SeriesDetail from '.';

describe('SeriesDetail component', () => {
  it('renders correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockSeries });
    });

    const wrapper = renderWithRedux(<SeriesDetail route={{ params: { seriesId: '5264f1b3-c8b8-428a-9fb8-7f075f03d0c8' } }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
