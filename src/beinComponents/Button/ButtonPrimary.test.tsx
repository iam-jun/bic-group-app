import React from 'react';

import { renderWithRedux, cleanup } from '~/test/testUtils';
import ButtonPrimary from './ButtonPrimary';

afterEach(cleanup);

describe('ButtonPrimary conponent', () => {
  const children = 'Button Primary';

  const testID = 'button_primary.test';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ButtonPrimary testID={testID}>{children}</ButtonPrimary>,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('renders color correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ButtonPrimary color="red" testID={testID}>
        {children}
      </ButtonPrimary>,
    );

    const component = getByTestId(testID);

    expect(component.props.style.backgroundColor).toBe('red');
  });

  it('renders textColor correctly', () => {
    const { getByTestId } = renderWithRedux(
      <ButtonPrimary textColor="red" testID={testID}>
        {children}
      </ButtonPrimary>,
    );

    const component = getByTestId(testID);

    expect(component.props.children[0].props.children[2].props.color).toBe(
      'red',
    );
  });
});
