import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import YourGroups from '~/screens/Groups/YourGroups/index';

describe('YourGroups Screen', () => {
  it(`renders group joined as default`, async () => {
    const wrapper = renderWithRedux(<YourGroups />);
    const groupJoined = wrapper.queryByTestId('group_joined');
    expect(groupJoined).not.toBeNull();
  });
});
