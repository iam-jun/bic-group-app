import React from 'react';

import { configureStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import CommentInputFooter from '~/beinComponents/inputs/CommentInput/CommentInputFooter';

describe('CommentInputFooter component', () => {
  const mockStore = configureStore([]);

  it('renders correctly mention bar invisible', async () => {
    const storeData = { ...initialState };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<CommentInputFooter />, store);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly mention bar with item', async () => {
    const wrapper = renderWithRedux(<CommentInputFooter />);
    expect(wrapper).toMatchSnapshot();
  });
});
