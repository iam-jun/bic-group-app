import { cleanup } from '@testing-library/react-native';
import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { Default } from '~/baseComponents/Button/ButtonRaise/index.stories';
import ButtonRaise from './index';

afterEach(cleanup);

describe('Button component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<ButtonRaise {...Default.args} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly default props', () => {
    const rendered = renderWithRedux(<Default />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
  it('should call props onPress', () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <Default {...Default.args} testID="button" onPress={onPress} />,
    );
    const button = rendered.getByTestId('button');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  });
});
