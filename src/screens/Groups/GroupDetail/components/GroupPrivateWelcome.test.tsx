import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import GroupPrivateWelcome from './GroupPrivateWelcome';

describe('GroupPrivateWelcome component', () => {
  it('renders GroupInfoHeader component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome />);
    const component = wrapper.getByTestId('group_info_header');
    expect(component).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders GroupAboutContent component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome />);
    const component = wrapper.getByTestId('group_about_content');
    expect(component).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders bottom image correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome />);
    const component = wrapper.getByTestId('group_private_welcome.bottom_image');
    expect(component).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
