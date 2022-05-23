import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';

import NoNotificationFound from './NoNotificationFound';

afterEach(cleanup);

describe('NoNotificationFound component', () => {
  it(`renders correctly`, () => {
    const rendered = render(<NoNotificationFound />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
