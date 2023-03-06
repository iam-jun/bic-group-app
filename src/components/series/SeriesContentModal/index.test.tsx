import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesContentModal from './index';
import * as navigationHook from '~/hooks/navigation';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { mockSeries } from '~/test/mock_data/series';
import { mockArticle } from '~/test/mock_data/article';
import useSeriesContentModalStore, { ISeriesContentModalState } from './store';

describe('SeriesContentModal component', () => {
  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <SeriesContentModal id={mockArticle.id} />,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should render empty component', () => {
    useSeriesContentModalStore.setState((state: ISeriesContentModalState) => {
      state.series.data = [];
      state.series.loading = false;
      return state;
    });

    const rendered = renderWithRedux(
      <SeriesContentModal id={mockArticle.id} />,
    );

    const emptyComponent = rendered.queryByTestId('series_content_modal.box_empty');

    expect(emptyComponent).toBeDefined();
  });

  it('should not render empty component when loading', () => {
    useSeriesContentModalStore.setState((state: ISeriesContentModalState) => {
      state.series.data = [mockSeries];
      state.series.loading = true;
      return state;
    });

    const rendered = renderWithRedux(
      <SeriesContentModal id={mockArticle.id} />,
    );

    const emptyComponent = rendered.queryByTestId('series_content_modal.box_empty');

    expect(emptyComponent).toBeNull();
  });

  it('should render navigate to SeriesDetail', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    useSeriesContentModalStore.setState((state: ISeriesContentModalState) => {
      state.series.data = [mockSeries];
      state.series.loading = false;
      return state;
    });

    const rendered = renderWithRedux(
      <SeriesContentModal id={mockArticle.id} />,
    );

    const btnSeries = rendered.getByTestId('series_item_modal.button');

    expect(btnSeries).toBeDefined();
    fireEvent.press(btnSeries);
    expect(navigate).toBeCalledWith(seriesStack.seriesDetail, { seriesId: mockSeries.id });
  });
});
