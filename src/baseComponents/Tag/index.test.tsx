import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react-native';

import { AvatarTag, NameTag, TextOnly } from './index.stories';

afterEach(cleanup);

describe('Tag component', () => {
  it('should call props onActionPress', () => {
    const onActionPress = jest.fn();
    const { getByTestId } = render(<TextOnly {...TextOnly.args} onActionPress={onActionPress} />);
    const tagComponent = getByTestId('tag.item');
    expect(tagComponent).toBeDefined();
    fireEvent.press(tagComponent);
    expect(onActionPress).toBeCalled();
  });

  it('renders correctly Tag component type NameTag', () => {
    const rendered = render(<NameTag {...NameTag.args} />);

    const { getByTestId } = rendered;
    const labelComponent = getByTestId('tag.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props?.children).toBe(NameTag.args.label);
  });

  it('renders correctly Tag component type AvatarTag', () => {
    const rendered = render(<AvatarTag {...AvatarTag.args} />);

    const { getByTestId } = rendered;
    const labelComponent = getByTestId('tag.label');
    expect(labelComponent).toBeDefined();
    expect(labelComponent.props?.children).toBe(AvatarTag.args.label);
  });

  it('should call props onPressIcon', () => {
    const onPressIcon = jest.fn();
    const { getByTestId } = render(<NameTag {...NameTag.args} onPressIcon={onPressIcon} />);
    const iconComponent = getByTestId('tag.icon');
    expect(iconComponent).toBeDefined();
    fireEvent.press(iconComponent);
    expect(onPressIcon).toBeCalled();
  });

  it('should disable button when props disabled = true', () => {
    const { getByTestId } = render(<TextOnly {...TextOnly.args} disabled />);
    const tagComponent = getByTestId('tag.item');
    expect(tagComponent).toBeDefined();
    expect(tagComponent.props?.accessibilityState?.disabled).toBeTruthy();
  });

  it('should render correctly style when change style of props', () => {
    const { getByTestId } = render(<TextOnly {...TextOnly.args} style={{ backgroundColor: 'red' }} />);
    const tagComponent = getByTestId('tag.item');
    expect(tagComponent).toBeDefined();
    expect(tagComponent.props?.style?.backgroundColor).toBe('red');
  });
});
