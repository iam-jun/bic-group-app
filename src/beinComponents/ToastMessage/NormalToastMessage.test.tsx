import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import NormalToastMessage from './NormalToastMessage';
import colors from '~/theme/theme';
import {StyleSheet} from 'react-native';

afterEach(cleanup);

describe('NormalToastMessage component', () => {
  const children = 'Normal Toast Message';
  const rightText = 'Right text';

  it(`renders correctly`, () => {
    const rendered = renderWithRedux(
      <NormalToastMessage>{children}</NormalToastMessage>,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders toast type success with green color correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage type={'success'}>{children}</NormalToastMessage>,
    );
    const buttonComponent = getByTestId('normal_toast_message');
    expect(buttonComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
  });

  it(`renders toast type error with red color correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage type={'error'}>{children}</NormalToastMessage>,
    );
    const buttonComponent = getByTestId('normal_toast_message');
    expect(buttonComponent.props.style.backgroundColor).toBe(
      colors.light.colors.red60,
    );
  });

  it(`renders children content correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage type={'success'}>{children}</NormalToastMessage>,
    );
    const childrenComponent = getByTestId('normal_toast_message.children');
    expect(childrenComponent.props.children).toEqual(children);
  });

  it(`renders textProps correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage textProps={{style: {fontSize: 20}}}>
        {children}
      </NormalToastMessage>,
    );
    const childrenComponent = getByTestId('normal_toast_message.children');
    const flattenedStyle = StyleSheet.flatten(childrenComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(20);
  });

  it(`renders container style correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage type={'success'} style={{margin: 12}}>
        {children}
      </NormalToastMessage>,
    );
    const childrenComponent = getByTestId('normal_toast_message');
    expect(childrenComponent.props.style.margin).toBe(12);
  });

  it(`renders leftIcon correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage type="success" leftIcon={'Check'}>
        {children}
      </NormalToastMessage>,
    );
    const leftIcon = getByTestId('normal_toast_message.left_icon');
    expect(leftIcon.props.children).toBeDefined();
  });

  it(`renders leftIconColor correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage
        type="success"
        leftIcon={'Check'}
        leftIconColor="yellow">
        {children}
      </NormalToastMessage>,
    );
    const leftIcon = getByTestId('normal_toast_message.left_icon');
    expect(leftIcon.props.children).toBeDefined();
    expect(leftIcon.props.children.props.tintColor).toEqual('yellow');
  });

  it(`renders onActionPress correctly`, () => {
    const onActionPress = jest.fn();

    const {getByTestId} = renderWithRedux(
      <NormalToastMessage onActionPress={onActionPress}>
        {children}
      </NormalToastMessage>,
    );

    const buttonComponent = getByTestId('normal_toast_message');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
    expect(onActionPress).toBeCalled();
  });

  it(`renders right text correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage rightText={rightText}>{children}</NormalToastMessage>,
    );

    const textComponent = getByTestId('normal_toast_message.right_text');
    expect(textComponent.props.children).toEqual(rightText);
  });

  it(`renders onPressRight correctly`, () => {
    const onPressRight = jest.fn();

    const {getByTestId} = renderWithRedux(
      <NormalToastMessage
        type={'success'}
        rightText={rightText}
        onPressRight={onPressRight}>
        {children}
      </NormalToastMessage>,
    );

    const buttonComponent = getByTestId('normal_toast_message.right_button');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
    expect(onPressRight).toBeCalled();
  });

  it(`renders rightIcon correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage
        type={'success'}
        rightText={rightText}
        rightIcon={'UserGroup'}>
        {children}
      </NormalToastMessage>,
    );
    const rightIcon = getByTestId('normal_toast_message.right_icon');
    expect(rightIcon.props.children).toBeDefined();
  });

  it(`renders rightTextColor correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage rightText={rightText} rightTextColor={'red'}>
        {children}
      </NormalToastMessage>,
    );

    const textComponent = getByTestId('normal_toast_message.right_text');
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.color).toEqual('red');
  });

  it(`renders rightTextStyle correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage
        type={'success'}
        rightText={rightText}
        rightTextStyle={{textDecorationColor: 'black'}}>
        {children}
      </NormalToastMessage>,
    );
    const childrenComponent = getByTestId('normal_toast_message.right_text');
    const flattenedStyle = StyleSheet.flatten(childrenComponent.props.style);
    expect(flattenedStyle.textDecorationColor).toBe('black');
  });

  it(`renders rightTextProps correctly`, () => {
    const {getByTestId} = renderWithRedux(
      <NormalToastMessage
        type={'success'}
        rightText={rightText}
        rightTextProps={{numberOfLines: 1}}>
        {children}
      </NormalToastMessage>,
    );
    const childrenComponent = getByTestId('normal_toast_message.right_text');
    expect(childrenComponent.props.numberOfLines).toBe(1);
  });
});
