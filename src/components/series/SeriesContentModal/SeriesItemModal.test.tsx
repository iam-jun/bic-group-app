import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SeriesItemModal from './SeriesItemModal';
import { mockSeries } from '~/test/mock_data/series';

describe('SeriesItemModal component', () => {
  it('should render correctly', () => {
    const onPressItem = jest.fn();

    const rendered = renderWithRedux(
      <SeriesItemModal
        data={mockSeries}
        onPressItem={onPressItem}
      />,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should call prop onPressItem', () => {
    const onPressItem = jest.fn();

    const rendered = renderWithRedux(
      <SeriesItemModal
        data={mockSeries}
        onPressItem={onPressItem}
      />,
    );

    const btnContainer = rendered.getByTestId('series_item_modal.button');
    expect(btnContainer).toBeDefined();
    fireEvent.press(btnContainer);
    expect(onPressItem).toBeCalled();
  });
});
