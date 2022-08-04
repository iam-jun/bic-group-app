import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux} from '~/test/testUtils';
import ButtonSecondary from './ButtonSecondary';
import colors from '~/theme/theme';

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

  it('renders highEmphasis correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonSecondary highEmphasis testID={testID}>
        {children}
      </ButtonSecondary>,
    );
    const component = getByTestId(testID);
    expect(component.props.style.backgroundColor).toBe(
      colors.light.colors.purple30,
    );
  });

  it('renders disabled correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonSecondary disabled testID={testID}>
        {children}
      </ButtonSecondary>,
    );
    const component = getByTestId(testID);
    expect(component.props.style.backgroundColor).toBe(
      colors.light.colors.gray20,
    );
  });
});
