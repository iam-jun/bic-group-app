import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {useTheme} from 'react-native-paper';

import {createTextStyle} from '~/beinComponents/Text/textStyle';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';

afterEach(cleanup);

describe('Text component', () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createTextStyle(theme);
  it(`renders correctly`, () => {
    const rendered = render(<Text />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly children`, () => {
    const rendered = render(<Text>renders correctly children</Text>);
    expect(rendered).not.toBe(undefined);
  });

  it(`renders correctly children with useI18n`, () => {
    const rendered = render(<Text useI18n>renders correctly children</Text>);
    expect(rendered).not.toBe(undefined);
  });

  it(`renders correctly text color`, () => {
    const {getByTestId} = render(
      <Text testID="text" color="green">
        renders correctly children
      </Text>,
    );
    const renderedComponent = getByTestId('text');
    expect(renderedComponent.props.style.color).toBe('green');
  });

  it(`renders correctly variant`, () => {
    const {getByTestId} = render(
      <Text variant="h5" testID="text.h5">
        renders correctly children
      </Text>,
    );
    const renderedComponent = getByTestId('text.h5');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h5.fontSize);
  });

  it(`renders correctly variant H1`, () => {
    const {getByTestId} = render(
      <Text.H1 testID="text.h1">renders correctly children</Text.H1>,
    );
    const renderedComponent = getByTestId('text.h1');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h1.fontSize);
  });

  it(`renders correctly variant H2`, () => {
    const {getByTestId} = render(
      <Text.H2 testID="text.h2">renders correctly children</Text.H2>,
    );
    const renderedComponent = getByTestId('text.h2');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h2.fontSize);
  });

  it(`renders correctly variant H3`, () => {
    const {getByTestId} = render(
      <Text.H3 testID="text.h3">renders correctly children</Text.H3>,
    );
    const renderedComponent = getByTestId('text.h3');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h3.fontSize);
  });

  it(`renders correctly variant H4`, () => {
    const {getByTestId} = render(
      <Text.H4 testID="text.h4">renders correctly children</Text.H4>,
    );
    const renderedComponent = getByTestId('text.h4');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h4.fontSize);
  });

  it(`renders correctly variant H5`, () => {
    const {getByTestId} = render(
      <Text.H5 testID="text.h5">renders correctly children</Text.H5>,
    );
    const renderedComponent = getByTestId('text.h5');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h5.fontSize);
  });

  it(`renders correctly variant H6`, () => {
    const {getByTestId} = render(
      <Text.H6 testID="text.h6">renders correctly children</Text.H6>,
    );
    const renderedComponent = getByTestId('text.h6');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h6.fontSize);
  });

  it(`renders correctly variant H6`, () => {
    const {getByTestId} = render(
      <Text.H6S testID="text.h6s">renders correctly children</Text.H6S>,
    );
    const renderedComponent = getByTestId('text.h6s');
    expect(renderedComponent.props.style.fontSize).toBe(styles.h6s.fontSize);
  });
});
