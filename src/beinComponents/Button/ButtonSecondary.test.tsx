import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux} from '~/test/testUtils';
import ButtonSecondary from './ButtonSecondary';

afterEach(cleanup);

describe('ButtonSecondary conponent', () => {
  const children = 'Button Secondary';
  const testID = 'button_secondary.test';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ButtonSecondary testID={testID}>{children}</ButtonSecondary>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders color correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonSecondary color="red" testID={testID}>
        {children}
      </ButtonSecondary>,
    );
    const component = getByTestId(testID);
    expect(component.props.style.backgroundColor).toBe('red');
  });

  it('renders textColor correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonSecondary textColor="red" testID={testID}>
        {children}
      </ButtonSecondary>,
    );
    const component = getByTestId(testID);
    expect(component.props.children[0].props.children[2].props.color).toBe(
      'red',
    );
  });
});
