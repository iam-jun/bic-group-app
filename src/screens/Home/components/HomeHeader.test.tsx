import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import HomeHeader from './HomeHeader';
import useHomeStore from '../store';

describe('HomeHeader component', () => {
  const props = {
    onPressSearch: jest.fn(),
    onPressChat: jest.fn(),
  };
  it('renders correctly', () => {
    const setContentFilter = jest.fn();
    const setAttributeFilter = jest.fn();
    useHomeStore.setState((state) => {
      state.actions.setAttributeFilter = setAttributeFilter;
      state.actions.setContentFilter = setContentFilter;
      return state;
    });

    const rendered = render(<HomeHeader {...props} />);
    const { getByTestId } = rendered;
    const containerView = getByTestId('home_header');
    expect(containerView).toBeDefined();

    const tab1 = getByTestId('tab-button-home:title_feed_content_all-selected');
    const tab2 = getByTestId('tab-button-home:title_feed_attritube_all-selected');
    fireEvent.press(tab1);
    expect(setContentFilter).toBeCalled();
    fireEvent.press(tab2);
    expect(setAttributeFilter).toBeCalled();
  });
});
