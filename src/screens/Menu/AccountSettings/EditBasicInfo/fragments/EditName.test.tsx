import React from 'react';

import {fireEvent} from '~/test/testUtils';
import {render, cleanup} from '@testing-library/react-native';
import {colors} from '~/theme';

import EditName from './EditName';

afterEach(cleanup);

describe('EditName conponent', () => {
  const name = 'Test Name';

  it('renders correctly', () => {
    const onChangeName = jest.fn();

    const rendered = render(
      <EditName error={false} fullname={name} onChangeName={onChangeName} />,
    ).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly outlineColor when blur text input', () => {
    const onChangeName = jest.fn();

    const rendered = render(
      <EditName error={false} fullname={name} onChangeName={onChangeName} />,
    );
    const inputComponent = rendered.getByTestId('edit_name.text_input');
    expect(inputComponent).toBeDefined();
    expect(inputComponent.props.outlineColor).toBe(colors.light.colors.gray40);
  });

  it('renders correctly activeOutlineColor when focus to text input', () => {
    const onChangeName = jest.fn();

    const rendered = render(
      <EditName error={false} fullname={name} onChangeName={onChangeName} />,
    );
    const inputComponent = rendered.getByTestId('edit_name.text_input');
    expect(inputComponent).toBeDefined();
    fireEvent.press(inputComponent);
    expect(inputComponent.props.activeOutlineColor).toBe(
      colors.light.colors.purple50,
    );
  });

  it('should call props onChangeName', () => {
    const onChangeName = jest.fn();

    const rendered = render(
      <EditName error={false} fullname={name} onChangeName={onChangeName} />,
    );
    const inputComponent = rendered.getByTestId('edit_name.text_input');
    expect(inputComponent).toBeDefined();
    fireEvent.changeText(inputComponent);

    expect(onChangeName).toBeCalled();
  });

  it('should show helperContent when error=true', () => {
    const onChangeName = jest.fn();

    const rendered = render(
      <EditName error={true} fullname={name} onChangeName={onChangeName} />,
    );
    const textHelper = rendered.getByTestId('text_input.text_helper');
    expect(textHelper).not.toBeNull();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
