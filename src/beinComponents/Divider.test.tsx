import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import Divider from '~/beinComponents/Divider';

afterEach(cleanup);

describe('Divider component', () => {
  it('renders correctly', () => {
    const rendered = render(<Divider />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly color', () => {
    const { getByTestId } = render(<Divider color="#B2BDCD" />);
    const dividerComponent = getByTestId('divider');
    expect(dividerComponent.props.style[0].backgroundColor).toBe('#B2BDCD');
  });

  it('renders correctly horizontal', () => {
    const { getByTestId } = render(<Divider horizontal />);
    const dividerComponent = getByTestId('divider');
    expect(dividerComponent.props.style[0].height).toBe(undefined);
  });
});
