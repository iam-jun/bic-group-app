import * as React from 'react';
import { cleanup } from '@testing-library/react-native';

import { renderWithRedux } from '~/test/testUtils';
import FileVideo from '.';

afterEach(cleanup);

describe('VideoPlayer component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <FileVideo src="" thumbnail="" />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
