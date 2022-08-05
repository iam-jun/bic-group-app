import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import Filter from './Filter';
import { renderWithRedux } from '~/test/testUtils';
import { communityMenuData } from '~/constants/communityMenuData';

afterEach(cleanup);

describe('Filter component', () => {
  it('renders correctly', () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <Filter data={communityMenuData} selectedIndex={0} onPress={onPress} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should called onPress prop', () => {
    const onPress = jest.fn();
    const selectedIndex = 0;
    const rendered = renderWithRedux(
      <Filter
        selectedIndex={selectedIndex}
        data={communityMenuData}
        onPress={onPress}
        testID="community_menu"
        itemTestID="item_community_data"
      />,
    );
    const itemComponent = rendered.getByTestId('item_community_data_2');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPress).toHaveBeenCalled();
  });
});
