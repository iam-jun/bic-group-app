import React from 'react';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import CommunityAdmin from '.';

describe('CommunityAdmin component', () => {
  it('should render data correctly', () => {
    const wrapper = renderWithRedux(<CommunityAdmin />);
    expect(wrapper).toMatchSnapshot();
  });
});
