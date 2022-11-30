import * as React from 'react';
import { mockListSeriesOfArticle, selectedSeries } from '~/test/mock_data/series';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ListSeriesWithAudiences from './ListSeriesWithAudiences';

describe('ListSeriesWithAudiences component', () => {
  it('render correctly', () => {
    const handleCheckedItem = jest.fn();
    const onLoadMore = jest.fn();

    const wrapper = renderWithRedux(<ListSeriesWithAudiences
      data={mockListSeriesOfArticle}
      selectedData={selectedSeries}
      loading={false}
      onCheckedItem={handleCheckedItem}
      onLoadMore={onLoadMore}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('render correctly when data is empty', () => {
    const handleCheckedItem = jest.fn();
    const onLoadMore = jest.fn();
    const wrapper = renderWithRedux(<ListSeriesWithAudiences
      data={[]}
      selectedData={[]}
      loading={false}
      onCheckedItem={handleCheckedItem}
      onLoadMore={onLoadMore}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('render correctly when loading = true', () => {
    const handleCheckedItem = jest.fn();
    const onLoadMore = jest.fn();
    const wrapper = renderWithRedux(<ListSeriesWithAudiences
      data={[]}
      selectedData={[]}
      loading
      onCheckedItem={handleCheckedItem}
      onLoadMore={onLoadMore}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should call onCheckedItem when check/uncheck item', () => {
    const handleCheckedItem = jest.fn();
    const onLoadMore = jest.fn();
    const wrapper = renderWithRedux(<ListSeriesWithAudiences
      data={mockListSeriesOfArticle}
      selectedData={selectedSeries}
      loading={false}
      onCheckedItem={handleCheckedItem}
      onLoadMore={onLoadMore}
    />);
    const component = wrapper.getAllByTestId('series_item.check_box');
    expect(component).toBeDefined();

    fireEvent.press(component[0]);
    expect(handleCheckedItem).toBeCalled();
  });
});
