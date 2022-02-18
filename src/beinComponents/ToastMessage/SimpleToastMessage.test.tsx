import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import SimpleToastMessage from './SimpleToastMessage';

afterEach(cleanup);

describe('SimpleToastMessage component', () => {
  const children = 'Simple Toast Message';

  it(`renders correctly`, () => {
    const rendered = renderWithRedux(
      <SimpleToastMessage>{children}</SimpleToastMessage>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders children correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <SimpleToastMessage>{children}</SimpleToastMessage>,
    );
    const childrenComponent = getByTestId('simple_toast_message.children');
    expect(childrenComponent).toBeDefined();
    expect(childrenComponent.props.children).toEqual(children);
  });

  it(`renders with textProps correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <SimpleToastMessage textProps={{style: {color: 'red'}}}>
        {children}
      </SimpleToastMessage>,
    );
    const childrenComponent = getByTestId('simple_toast_message.children');
    expect(childrenComponent.props.style.color).toBe('red');
  });

  it(`renders icon correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <SimpleToastMessage icon={'ArrowDown'}>{children}</SimpleToastMessage>,
    );
    const iconComponent = getByTestId('simple_toast_message.icon');
    expect(iconComponent).toBeDefined();
  });

  it(`renders onActionPress correctly`, () => {
    const onActionPress = jest.fn();

    const {getByTestId} = renderWithRedux(
      <SimpleToastMessage onActionPress={onActionPress}>
        {children}
      </SimpleToastMessage>,
    );

    const buttonComponent = getByTestId('simple_toast_message');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
    expect(onActionPress).toBeCalled();
  });

  it(`renders disabled toast button correctly`, () => {
    const onActionPress = jest.fn();

    const {getByTestId} = renderWithRedux(
      <SimpleToastMessage disabled onActionPress={onActionPress}>
        {children}
      </SimpleToastMessage>,
    );

    const buttonComponent = getByTestId('simple_toast_message');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
    expect(onActionPress).not.toBeCalled();
  });
});
