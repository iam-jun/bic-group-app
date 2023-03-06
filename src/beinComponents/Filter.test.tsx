import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react-native';

import Filter from './Filter';

afterEach(cleanup);

export const communityMenuData = [
  {
    id: 1,
    text: 'communities:community_menu:your_communities_text',
    type: 'COMMUNITIES',
  },
  {
    id: 2,
    text: 'communities:community_menu:manage_text',
    type: 'MANAGE',
  },
  {
    id: 3,
    text: 'communities:community_menu:discover_text',
    type: 'DISCOVER',
  },
];

describe('Filter component', () => {
  it('renders correctly', () => {
    const onPress = jest.fn();
    const rendered = render(
      <Filter
        data={communityMenuData}
        onPress={onPress}
        testID="community_menu"
        itemTestID="item_community_data"
        translateX={{
          value: 0,
        }}
      />,
    );
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('community_menu');
    expect(containerComponent).toBeDefined();

    const containerItem = rendered.getByTestId(`container_item_community_data_${communityMenuData[0].text}`);
    fireEvent(containerItem, 'layout', {
      nativeEvent: { layout: { height: 100 } },
    });
    const itemComponent = rendered.getByTestId(`item_community_data_${communityMenuData[0].text}`);
    fireEvent.press(itemComponent);
    expect(onPress).toHaveBeenCalled();
  });
});
