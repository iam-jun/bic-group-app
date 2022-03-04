import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import CreatePostFooter from '~/screens/Post/CreatePost/CreatePostFooter';

describe('CreatePostFooter component', () => {
  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<CreatePostFooter />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
