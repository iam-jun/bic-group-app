import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import i18next from 'i18next';
import { StyleSheet } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Button from '.';

afterEach(cleanup);

describe('Button component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<Button />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders button primary correctly', () => {
    const rendered = renderWithRedux(<Button.Primary />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders button secondary correctly', () => {
    const rendered = renderWithRedux(<Button.Secondary />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders button neutral correctly', () => {
    const rendered = renderWithRedux(<Button.Neutral />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders button success correctly', () => {
    const rendered = renderWithRedux(<Button.Success />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders button danger correctly', () => {
    const rendered = renderWithRedux(<Button.Danger />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly button disable', () => {
    const rendered = renderWithRedux(
      <Button testID="button" disabled />,
    );
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button');

    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly button loading', () => {
    const rendered = renderWithRedux(
      <Button testID="button" loading>Loading</Button>,
    );
    const { getByTestId } = rendered;
    const loadingComponent = getByTestId('button.loading');

    expect(loadingComponent).toBeDefined();
  });

  it('renders correctly style', () => {
    const rendered = renderWithRedux(
      <Button
        testID="button"
        style={{ padding: 10 }}
      />,
    );
    const { getByTestId } = rendered;
    const btnComponent = getByTestId('button');
    expect(btnComponent.props?.style?.padding).toBe(10);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly contentStyle', () => {
    const rendered = renderWithRedux(
      <Button contentStyle={{ padding: 10 }} />,
    );
    const { getByTestId } = rendered;
    const contentComponent = getByTestId('button.content');
    const flattenedStyle = StyleSheet.flatten(contentComponent.props.style);
    expect(flattenedStyle.padding).toBe(10);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call props onPress', () => {
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <Button testID="button" onPress={onPress} />,
    );

    const btnComponent = rendered.getByTestId('button');
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).toBeCalled();
  });

  it('should call props onLongPress', async () => {
    const onLongPress = jest.fn();

    const rendered = renderWithRedux(
      <Button
        testID="button"
        onLongPress={onLongPress}
      />,
    );

    const btnComponent = rendered.getByTestId('button');
    expect(btnComponent).toBeDefined();
    fireEvent(btnComponent, 'onLongPress');
    expect(onLongPress).toBeCalled();
  });

  it('renders correctly with only icon', () => {
    const rendered = renderWithRedux(
      <Button icon="FaceSmile" />,
    );
    const { getByTestId, queryByTestId } = rendered;
    const textComponent = queryByTestId('button.text');
    const iconComponent = getByTestId('button.icon');

    expect(textComponent).toBeNull();
    expect(iconComponent).toBeDefined();
  });

  it('renders correctly with text and icon', () => {
    const rendered = renderWithRedux(
      <Button icon="FaceSmile">text content</Button>,
    );
    const { getByTestId } = rendered;
    const textComponent = getByTestId('button.text');
    const iconComponent = getByTestId('button.icon');

    expect(textComponent).toBeDefined();
    expect(iconComponent).toBeDefined();

    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.marginLeft).toBe(8);
  });

  it('renders correctly children with useI18n', () => {
    const rendered = renderWithRedux(
      <Button useI18n>
       common:text_see_less
      </Button>,
    );
    expect(rendered).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

});