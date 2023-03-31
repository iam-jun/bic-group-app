import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import i18next from 'i18next';

import { TouchableHighlight } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import useNetworkStore, { INetworkState } from '~/store/network';
import { fireEvent, render } from '~/test/testUtils';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/baseComponents/Icon';

afterEach(cleanup);

describe('Button Wrapper component', () => {
  it('renders correctly children', () => {
    const rendered = render(
      <ButtonWrapper>
        <Icon testID="button_wrapper.children" icon="menu" />
      </ButtonWrapper>,
    );
    const { getByTestId } = rendered;
    const childrenComponent = getByTestId('button_wrapper.children');
    expect(childrenComponent).toBeDefined();
  });

  it('renders correctly testID', () => {
    const rendered = render(
      <ButtonWrapper testID="button_wrapper" />,
    );
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
  });

  it('renders correctly button disable', () => {
    const rendered = render(
      <ButtonWrapper testID="button_wrapper" disabled />,
    );
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
  });

  it('renders correctly style', () => {
    const rendered = render(
      <ButtonWrapper
        testID="button_wrapper"
        style={{ backgroundColor: 'blue' }}
      />,
    );
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button_wrapper');
    expect(btnComponent.props?.style?.backgroundColor).toBe('blue');
  });

  it('renders correctly contentStyle', () => {
    const rendered = render(
      <ButtonWrapper contentStyle={{ backgroundColor: 'blue' }} />,
    );
    const { getByTestId } = rendered;
    const contentComponent = getByTestId('button_wrapper.content');
    expect(contentComponent.props?.style?.[1]?.backgroundColor).toBe('blue');
  });

  it('should call props onPress', () => {
    const onPress = jest.fn();

    const rendered = render(
      <ButtonWrapper testID="button_wrapper" onPress={onPress} />,
    );

    const btnComponent = rendered.getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).toBeCalled();
  });

  it('should not call props onPress when cant connect to internet', () => {
    useNetworkStore.setState((state:INetworkState) => {
      state.isInternetReachable = false;
      return state;
    });

    const onPress = jest.fn();

    const rendered = render(
      <ButtonWrapper testID="button_wrapper" onPress={onPress} />,
    );

    const btnComponent = rendered.getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).not.toBeCalled();
  });

  it('should call props onLongPress', async () => {
    const onLongPress = jest.fn();

    const rendered = render(
      <ButtonWrapper
        testID="button_wrapper"
        onLongPress={onLongPress}
      />,
    );

    const btnComponent = rendered.getByTestId('button_wrapper');
    expect(btnComponent).toBeDefined();
    fireEvent(btnComponent, 'onLongPress');
    expect(onLongPress).toBeCalled();
  });

  it('renders correctly text props', () => {
    const rendered = render(
      <ButtonWrapper textProps={{ color: 'red', testID: 'button_wrapper.text' }}>
        Button
      </ButtonWrapper>,
    );
    const { getByTestId } = rendered;
    const textComponent = getByTestId('button_wrapper.text');
    expect(textComponent).toBeDefined();
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle?.color).toBe('red');
  });

  it('renders correctly children with useI18n', () => {
    const rendered = render(
      <ButtonWrapper useI18n>
        {i18next.t('common:text_see_less')}
      </ButtonWrapper>,
    );
    expect(rendered).toBeDefined();
  });

  it('should render leftIcon', () => {
    const rendered = render(
      <ButtonWrapper leftIcon="Calendar" />,
    );
    const leftIcon = rendered.getByTestId('button_wrapper.icon');
    expect(leftIcon).toBeDefined();
  });

  it('should render leftIcon with leftIconProps', () => {
    const rendered = render(
      <ButtonWrapper
        leftIcon="Calendar"
        leftIconProps={{
          icon: 'AngleRightSolid',
          testID: 'LEFT_ICON',
        }}
      />,
    );
    const leftIcon = rendered.getByTestId('LEFT_ICON');
    expect(leftIcon).toBeDefined();
  });

  it('should render rightIcon', () => {
    const rendered = render(
      <ButtonWrapper rightIcon="Calendar" />,
    );
    const rightIcon = rendered.getByTestId('button_wrapper.icon');
    expect(rightIcon).toBeDefined();
  });

  it('should render rightIcon with rightIconProps', () => {
    const rendered = render(
      <ButtonWrapper
        rightIcon="AngleRightSolid"
        rightIconProps={{
          icon: 'AngleRightSolid',
          testID: 'RIGHT_ICON',
        }}
      />,
    );
    const rightIcon = rendered.getByTestId('RIGHT_ICON');
    expect(rightIcon).toBeDefined();
  });

  it('render correctly TouchableComponent', () => {
    const rendered = render(
      <ButtonWrapper
        testID="button_wrapper"
        TouchableComponent={TouchableHighlight}
      />,
    );
    expect(rendered).toBeDefined();
    expect(rendered.getByTestId('button_wrapper').type).toEqual(
      'RNGestureHandlerButton',
    );
  });

  it('render correctly hitSlop', () => {
    const rendered = render(
      <ButtonWrapper
        testID="button_wrapper"
        hitSlop={{
          top: 10, bottom: 10, right: 10, left: 10,
        }}
      />,
    );
    expect(rendered.getByTestId('button_wrapper').props?.hitSlop).toEqual({
      top: 10,
      bottom: 10,
      right: 10,
      left: 10,
    });
  });
});
