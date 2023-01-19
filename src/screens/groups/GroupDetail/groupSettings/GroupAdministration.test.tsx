/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import GroupAdministration from './GroupAdministration';

describe('GroupAdministration component', () => {
  it('should render data correctly', () => {
    const props = { route: { params: { groupId: '123' } } };
    const wrapper = renderWithRedux(<GroupAdministration {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
