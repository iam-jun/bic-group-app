import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import Filter from './Filter';
import { renderWithRedux } from '~/test/testUtils';

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
    const rendered = renderWithRedux(
      <Filter
        data={communityMenuData}
        onPress={onPress}
        translateX={{
          value: undefined,
        }}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should called onPress prop', () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <Filter
        data={communityMenuData}
        onPress={onPress}
        testID="community_menu"
        itemTestID="item_community_data"
        translateX={{
          value: undefined,
        }}
      />,
    );
    const itemComponent = rendered.getByTestId('item_community_data_2');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPress).toHaveBeenCalled();
  });
});
