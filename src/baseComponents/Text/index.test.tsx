import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { StyleSheet } from 'react-native';
import { createTextStyle } from '~/baseComponents/Text/textStyle';
import Text from '~/baseComponents/Text';

afterEach(cleanup);

describe('Text component', () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createTextStyle(theme);
  it('renders correctly', () => {
    const rendered = render(<Text />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly children', () => {
    const rendered = render(<Text>renders correctly children</Text>);
    expect(rendered).not.toBe(undefined);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly children with useI18n', () => {
    const rendered = render(<Text useI18n>renders correctly children</Text>);
    expect(rendered).not.toBe(undefined);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly text color', () => {
    const { getByTestId } = render(
      <Text testID="text" color="green">
        renders correctly children
      </Text>,
    );
    const renderedComponent = getByTestId('text');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.color).toBe('green');
  });

  it('renders correctly variant', () => {
    const rendered = render(
      <Text variant="h5" testID="text.h5">
        renders correctly children
      </Text>,
    );
    const renderedComponent = rendered.getByTestId('text.h5');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h5.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H1', () => {
    const rendered = render(
      <Text.H1 testID="text.h1">renders correctly children</Text.H1>,
    );
    const renderedComponent = rendered.getByTestId('text.h1');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h1.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H2', () => {
    const rendered = render(
      <Text.H2 testID="text.h2">renders correctly children</Text.H2>,
    );
    const renderedComponent = rendered.getByTestId('text.h2');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h2.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H3', () => {
    const rendered = render(
      <Text.H3 testID="text.h3">renders correctly children</Text.H3>,
    );
    const renderedComponent = rendered.getByTestId('text.h3');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h3.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H4', () => {
    const rendered = render(
      <Text.H4 testID="text.h4">renders correctly children</Text.H4>,
    );
    const renderedComponent = rendered.getByTestId('text.h4');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h4.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H5', () => {
    const rendered = render(
      <Text.H5 testID="text.h5">renders correctly children</Text.H5>,
    );
    const renderedComponent = rendered.getByTestId('text.h5');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h5.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly variant H6', () => {
    const rendered = render(
      <Text.H6 testID="text.h6">renders correctly children</Text.H6>,
    );
    const renderedComponent = rendered.getByTestId('text.h6');
    const flattenedStyle = StyleSheet.flatten(renderedComponent.props.style);
    expect(flattenedStyle.fontSize).toBe(styles.h6.fontSize);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
