import * as React from 'react';
import { mockSeries, mockSeriesWithSummary } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesDetailHeader from '.';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

describe('SeriesDetailHeader component', () => {
  it('given audiences, should render n audience', () => {
    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagViews = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagViews).toHaveLength(mockSeries.audience.groups.length);
  });

  it('should navigate to community detail when press audience is community', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagView = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagView).toBeDefined();
    fireEvent.press(tagView[0]);

    expect(navigate).toBeCalledWith(mainStack.communityDetail, { communityId: 'e4b06eda-94d6-42d0-8829-d5380bc8f95b' });
  });

  it('should navigate to group detail when press audience is group', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<SeriesDetailHeader series={mockSeries} />);

    const tagView = wrapper.getAllByTestId('series_detail_header.audience_tag');
    expect(tagView).toBeDefined();
    fireEvent.press(tagView[1]);

    expect(navigate).toBeCalledWith(mainStack.groupDetail,
      {
        groupId: 'eba85417-ec3e-49b4-89b4-c5393baecddf',
        communityId: 'b5c7a117-dcb8-47ba-9677-dc33da045bas',
      });
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
