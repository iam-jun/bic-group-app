import React from 'react';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import DiscoverItem from './DiscoverItem';
import { communityDetailData } from '~/test/mock_data/communities';
import { ICommunity } from '~/interfaces/ICommunity';

describe('DiscoverItem component', () => {
  const onPressView = jest.fn();
  const onPressJoin = jest.fn();
  const onPressCancel = jest.fn();
  it('should render data correctly', () => {
    const itemData = { ...communityDetailData } as ICommunity;
    const wrapper = renderWithRedux(
      <DiscoverItem
        testID="discover_item"
        item={itemData}
        onPressView={onPressView}
        onPressJoin={onPressJoin}
        onPressCancel={onPressCancel}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onPressView correctly', () => {
    const itemData = { ...communityDetailData } as ICommunity;
    const wrapper = renderWithRedux(
      <DiscoverItem
        testID="discover_item"
        item={itemData}
        onPressView={onPressView}
        onPressJoin={onPressJoin}
        onPressCancel={onPressCancel}
      />,
    );
    const item = wrapper.getByTestId('discover_item');
    expect(item).toBeDefined();
    fireEvent.press(item);
    expect(onPressView).toBeCalled();
  });
});
