import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import SeriesContent from '.';
import { mockSeries, mockSeriesWithSummary } from '../../../test/mock_data/series';

describe('SeriesContent component', () => {
  it('given description = null, should render without description view', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeries} />);
    const descriptionView = wrapper.queryByTestId('series_detail_header.description');
    expect(descriptionView).toBeNull();
  });

  it('given description !== null, should render description view', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeriesWithSummary} />);
    const descriptionView = wrapper.queryByTestId('series_detail_header.description');
    expect(descriptionView).toBeDefined();
  });

  it('render without description view', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeries} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('render with description view', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeriesWithSummary} />);
    expect(wrapper).toMatchSnapshot();
  });
});
