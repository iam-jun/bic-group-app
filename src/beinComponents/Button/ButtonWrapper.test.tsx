import * as React from 'react';
import {cleanup} from '@testing-library/react-native';
import i18next from 'i18next';

import {fireEvent, renderWithRedux} from '~/test/testUtils';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

afterEach(cleanup);

describe('Button Wrapper component', () => {
  it(`renders correctly`, () => {
    const rendered = renderWithRedux(<ButtonWrapper></ButtonWrapper>).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly children`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper>
        <Icon testID="button_wrapper.children" icon={'Ellipsis'} />
      </ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const childrenComponent = getByTestId('button_wrapper.children');
    expect(childrenComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly testID`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper testID="button_wrapper"></ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly button disable`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper testID="button_wrapper" disabled></ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly style`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper
        testID="button_wrapper"
        style={{backgroundColor: 'blue'}}></ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent.props?.style?.backgroundColor).toBe('blue');
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`renders correctly contentStyle`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper contentStyle={{backgroundColor: 'blue'}}></ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const contentComponent = getByTestId('button_wrapper.content');
    expect(contentComponent.props?.style?.backgroundColor).toBe('blue');
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should call props onPress`, () => {
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <ButtonWrapper testID="button_wrapper" onPress={onPress}></ButtonWrapper>,
    );

    const btnComponent = rendered.getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).toBeCalled();
  });

  it(`should call props onLongPress`, async () => {
    const onLongPress = jest.fn();

    const rendered = renderWithRedux(
      <ButtonWrapper
        testID="button_wrapper"
        onLongPress={onLongPress}></ButtonWrapper>,
    );

    const btnComponent = rendered.getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    fireEvent(btnComponent, 'onLongPress');
    expect(onLongPress).toBeCalled();
  });

  it(`renders correctly text props`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper textProps={{color: 'red', testID: 'button_wrapper.text'}}>
        Button
      </ButtonWrapper>,
    );
    const {getByTestId} = rendered;
    const textComponent = getByTestId('button_wrapper.text');
    expect(textComponent).toBeDefined();
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle?.color).toBe('red');
  });

  it(`renders correctly children with useI18n`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper useI18n>
        {i18next.t('common:text_see_less')}
      </ButtonWrapper>,
    );
    expect(rendered).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should render leftIcon`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper leftIcon={'Calendar'}></ButtonWrapper>,
    );
    const leftIcon = rendered.getByTestId('button_wrapper.icon');
    expect(leftIcon).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should render leftIcon with leftIconProps`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper
        leftIcon={'Calendar'}
        leftIconProps={{
          icon: 'AngleRightSolid',
          testID: 'LEFT_ICON',
        }}></ButtonWrapper>,
    );
    const leftIcon = rendered.getByTestId('LEFT_ICON');
    expect(leftIcon).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should render rightIcon`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper rightIcon={'Calendar'}></ButtonWrapper>,
    );
    const rightIcon = rendered.getByTestId('button_wrapper.icon');
    expect(rightIcon).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should render rightIcon with rightIconProps`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper
        rightIcon={'AngleRightSolid'}
        rightIconProps={{
          icon: 'AngleRightSolid',
          testID: 'RIGHT_ICON',
        }}></ButtonWrapper>,
    );
    const rightIcon = rendered.getByTestId('RIGHT_ICON');
    expect(rightIcon).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`render correctly TouchableComponent`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper
        testID="button_wrapper"
        TouchableComponent={TouchableHighlight}></ButtonWrapper>,
    );
    expect(rendered).toBeDefined();
    expect(rendered.getByTestId('button_wrapper').type).toEqual(
      'RNGestureHandlerButton',
    );

    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`render correctly hitSlop`, () => {
    const rendered = renderWithRedux(
      <ButtonWrapper
        testID="button_wrapper"
        hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}></ButtonWrapper>,
    );
    expect(rendered.getByTestId('button_wrapper').props?.hitSlop).toEqual({
      top: 10,
      bottom: 10,
      right: 10,
      left: 10,
    });
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
