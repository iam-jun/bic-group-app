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

  //    variant?: TextVariant;
  //   children?: React.ReactNode;
  //   color?: string;
  //   useI18n?: boolean;
  //   it(`renders correctly color`, () => {
  //     const {getByTestId} = render(<Divider color={'#B2BDCD'} />);
  //     const dividerComponent = getByTestId('divider');
  //     expect(dividerComponent.props.style[0].backgroundColor).toBe('#B2BDCD');
  //   });

  //   it(`renders correctly horizontal`, () => {
  //     const {getByTestId} = render(<Divider horizontal={true} />);
  //     const dividerComponent = getByTestId('divider');
  //     expect(dividerComponent.props.style[0].height).toBe(undefined);
  //   });
});
