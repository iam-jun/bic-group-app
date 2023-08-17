import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import GroupPrivateWelcome from './GroupPrivateWelcome';
import { groupDetailData } from '~/test/mock_data/group';
import { IGroup } from '~/interfaces/IGroup';
import { communityDetailData } from '~/test/mock_data/communities';

describe('GroupPrivateWelcome component', () => {
  const baseProps = {
    infoDetail: groupDetailData as unknown as IGroup,
    isMember: false,
    community: communityDetailData,
    onScroll: jest.fn(),
    onGetInfoLayout: jest.fn(),
  };
  it('renders GroupInfoHeader component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome {...baseProps} />);
    const component = wrapper.getByTestId('info_header');
    expect(component).toBeDefined();
  });

  it('renders GroupAboutContent component correctly', () => {
    const wrapper = renderWithRedux(<GroupPrivateWelcome {...baseProps} />);
    const component = wrapper.queryByTestId('about_content_private');
    expect(component).toBeDefined();
  });
});
