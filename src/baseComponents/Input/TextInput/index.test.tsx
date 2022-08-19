import * as React from 'react';
import { render } from '@testing-library/react-native';

import { Default } from './index.stories'

describe('TextInput component', () => {
  it('renders active banner correctly', () => {
    const rendered = render(
      <Default {...Default.args} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  })
})
