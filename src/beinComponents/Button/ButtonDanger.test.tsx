import React from 'react';

import {renderWithRedux, cleanup, fireEvent} from '~/test/testUtils';
import colors from '~/theme/theme';

import ButtonDanger from './ButtonDanger';

afterEach(cleanup);

describe('ButtonDanger conponent', () => {
  const children = 'Button Danger';

  const testID = 'button_danger.test';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ButtonDanger testID={testID}>{children}</ButtonDanger>,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonDanger testID={testID}>{children}</ButtonDanger>,
    );
    const component = getByTestId(testID);

    expect(component.props.children[0].props.children[2].props.children).toBe(
      children,
    );
  });

  it('renders style correctly', () => {
    const {getByTestId} = renderWithRedux(
      <ButtonDanger style={{margin: 12}} testID={testID}>
        {children}
      </ButtonDanger>,
    );

    const component = getByTestId(testID);

    expect(component.props.style.margin).toBe(12);
  });

  it('renders disabled correctly', () => {
    const onPress = jest.fn();
    const {getByTestId} = renderWithRedux(
      <ButtonDanger disabled onPress={onPress} testID={testID}>
        {children}
      </ButtonDanger>,
    );

    const component = getByTestId(testID);
    fireEvent.press(component);
    expect(onPress).not.toBeCalled();

    expect(component.props.style.backgroundColor).toBe(
      colors.light.colors.gray20,
    );

    expect(component.props.children[0].props.children[2].props.color).toBe(
      colors.light.colors.gray40,
    );
  });
});
