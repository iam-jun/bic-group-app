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

  it('given titleHighlight and isLite === true should render title with titleHighlight', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeries} isLite />);
    expect(wrapper).toMatchSnapshot();
  });

  it('given titleHighlight and isLite === false should render title with title', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeries} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('given summaryHighlight and isLite === true should render summary with summaryHighlight', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeriesWithSummary} isLite />);
    expect(wrapper).toMatchSnapshot();
  });

  it('given summaryHighlight and isLite === false should render summary with summary', () => {
    const wrapper = renderWithRedux(<SeriesContent series={mockSeriesWithSummary} />);
    expect(wrapper).toMatchSnapshot();
  });
});
