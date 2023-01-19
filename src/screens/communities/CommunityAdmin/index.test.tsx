/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CommunityAdmin from './index';

describe('CommunityAdmin component', () => {
  it('should render data correctly', () => {
    const props = { route: { params: { communityId: '123' } } };
    const wrapper = renderWithRedux(<CommunityAdmin {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
