import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import PrivateWelcome from './PrivateWelcome';

describe('PrivateWelcome component', () => {
  it('renders InfoHeader component correctly', () => {
    const wrapper = renderWithRedux(<PrivateWelcome />);
    const component = wrapper.getByTestId('info_header');
    expect(component).toBeDefined();
  });

  it('renders JoinCancelButton component correctly', () => {
    const wrapper = renderWithRedux(<PrivateWelcome />);
    const component = wrapper.getByTestId('join_cancel_button');
    expect(component).toBeDefined();
  });

  it('renders AboutContent component correctly', () => {
    const wrapper = renderWithRedux(<PrivateWelcome />);
    const component = wrapper.getByTestId('about_content');
    expect(component).toBeDefined();
  });
});
