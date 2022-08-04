import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import GroupPrivateWelcome from './GroupPrivateWelcome';
import { groupDetailData } from '~/test/mock_data/group';

describe('GroupPrivateWelcome component', () => {
  const baseProps = { infoDetail: groupDetailData, isMember: false, onScroll: jest.fn(), onGetInfoLayout: jest.fn() }
  it('renders GroupInfoHeader component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome {...baseProps} />);
    const component = wrapper.getByTestId('info_header');
    expect(component).toBeDefined();
  });

  it('renders GroupAboutContent component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome {...baseProps} />);
    const component = wrapper.getByTestId('group_about_content');
    expect(component).toBeDefined();
  });
});
