import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BaseToast from '.';

describe('BaseToast component', () => {
  const content = 'Internet connection was restored';
  const onButtonPress = jest.fn();
  const onPressClose = jest.fn();

  it('renders success toast correctly', () => {
    const rendered = renderWithRedux(<BaseToast type="success" content={content} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders error toast correctly', () => {
    const rendered = renderWithRedux(<BaseToast type="error" content={content} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders full toast with button correctly', () => {
    const rendered = renderWithRedux(<BaseToast
      type="success"
      content={content}
      buttonText="Undo"
      onButtonPress={onButtonPress}
    />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call prop onButtonPress', () => {
    const rendered = renderWithRedux(<BaseToast
      type="success"
      content={content}
      buttonText="Undo"
      onButtonPress={onButtonPress}
    />);

    const button = rendered.getByTestId('toast_button_action');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onButtonPress).toBeCalled();
  });

  it('should call prop onPressClose', () => {
    const rendered = renderWithRedux(<BaseToast
      type="success"
      content={content}
      onPressClose={onPressClose}
    />);

    const button = rendered.getByTestId('toast_button_close');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(onPressClose).toBeCalled();
  });
});
