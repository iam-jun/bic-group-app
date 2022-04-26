import * as React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import CommunityMenu from './CommunityMenu';
import {renderWithRedux} from '~/test/testUtils';

afterEach(cleanup);

describe('CommunityMenu component', () => {
  it(`renders correctly`, () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <CommunityMenu selectedIndex={0} onPress={onPress} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should called onPress prop`, () => {
    const onPress = jest.fn();
    const selectedIndex = 0;
    const rendered = renderWithRedux(
      <CommunityMenu selectedIndex={selectedIndex} onPress={onPress} />,
    );
    const itemComponent = rendered.getByTestId('item_community_data_2');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPress).toHaveBeenCalled();
  });
});
