import * as React from 'react';
import { mockSeries, mockSeriesWithSummary } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesDetailHeader from '.';

describe('SeriesDetailHeader component', () => {
  it('given audiences, should render n audience', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagViews = wrapper.getAllByTestId('audience-tag');
    expect(tagViews).toHaveLength(1);
  });

  it('should be pressable audience', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagView = wrapper.getByTestId('audience-tag');
    fireEvent.press(tagView);
  });

  it('render without description view', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('render with description view', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeriesWithSummary} />);
    expect(wrapper).toMatchSnapshot();
  });
});
