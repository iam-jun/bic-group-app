import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import InfoItem from '.';

describe('InfoItem component', () => {
  const baseProps = {
    title: 'title',
    value: 'value',
  }

  afterEach(cleanup);

  it('renders correctly', () => {
    const rendered = render(<InfoItem {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders text_not_set', () => {
    const props = { ...baseProps, value: null };
    const { getByTestId } = render(<InfoItem {...props} />);

    const textValue = getByTestId('info_item.value');
    expect(textValue.props.children).toBe('Not set');
  });
});
