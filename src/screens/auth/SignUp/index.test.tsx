import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';

import { render } from '~/test/testUtils';
import SignUp from './index';

describe('SignUp component', () => {
  const baseProps = { route: { params: { isValidLink: true, referralCode: 'abc' } } };

  it('renders correctly', () => {
    const rendered = render(<MockedNavigator component={() => <SignUp {...baseProps} />} />);
    expect(rendered.toJSON()).toMatchSnapshot();

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('sign_up');
    expect(containerComponent).toBeDefined();
  });
});
