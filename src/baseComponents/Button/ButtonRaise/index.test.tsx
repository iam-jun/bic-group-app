import { cleanup } from '@testing-library/react-native';
import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { baseProps, Default } from '~/baseComponents/Button/ButtonRaise/index.stories';

afterEach(cleanup);

describe('Button component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<Default {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly default props', () => {
    const rendered = renderWithRedux(<Default />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
  it('should call props onPress', () => {
    const onPress = jest.fn();
    const rendered = renderWithRedux(
      <Default {...baseProps} testID="button" onPress={onPress} />,
    );
    const button = rendered.getByTestId('button');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  });
});
