import * as React from 'react';
import { mockSeries, mockSeriesWithSummary } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesDetailHeader from '.';
import * as common from '~/helpers/common';

describe('SeriesDetailHeader component', () => {
  it('given audiences, should render n audience', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagViews = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagViews).toHaveLength(mockSeries.audience.groups.length);
  });

  it('should push to community detail when press audience is community', () => {
    const navigateToCommunityDetail = jest.spyOn(common, 'navigateToCommunityDetail');

    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagView = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagView).toBeDefined();
    fireEvent.press(tagView[0]);

    expect(navigateToCommunityDetail).toBeCalled();
  });

  it('should push to group detail when press audience is group', () => {
    const navigateToGroupDetail = jest.spyOn(common, 'navigateToGroupDetail');

    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagView = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagView).toBeDefined();
    fireEvent.press(tagView[1]);

    expect(navigateToGroupDetail).toBeCalled();
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
