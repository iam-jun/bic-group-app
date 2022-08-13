/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import PasswordInput from './PasswordInput';

describe('Password Input component', () => {
  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<PasswordInput />);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly with hide icon eye', async () => {
    // @ts-ignore
    const wrapper = renderWithRedux(<PasswordInput hideEyeIcon />);
    const input = wrapper.getByTestId('password_input');
    expect(input?.props?.right).toBeFalsy();
  });
});
