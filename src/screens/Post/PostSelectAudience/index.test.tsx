import React from 'react';

import {configureStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostSelectAudience from '.';

describe('PostSelectAudience screen', () => {
  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<PostSelectAudience />);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
