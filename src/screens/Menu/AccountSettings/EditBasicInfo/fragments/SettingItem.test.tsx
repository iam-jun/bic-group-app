import React from 'react';

import { render, cleanup } from '@testing-library/react-native';
import i18next from 'i18next';
import { fireEvent, renderWithRedux } from '~/test/testUtils';

import SettingItem from './SettingItem';
import { IconType } from '~/resources/icons';

afterEach(cleanup);

describe('SettingItem conponent', () => {
  const baseProps = {
    title: 'settings:title_name',
    subtitle: i18next.t('common:text_not_set'),
    leftIcon: 'TextSize' as IconType,
  };

  it('renders correctly', () => {
    const rendered = render(<SettingItem {...baseProps} />).toJSON();

    expect(rendered).toMatchSnapshot();
  });

  it('should call props onPress', () => {
    const onPress = jest.fn();
    const rendered = render(<SettingItem {...baseProps} onPress={onPress} />);

    const itemComp = rendered.getByTestId('edit_user_info.setting_item');
    expect(itemComp).toBeDefined();
    fireEvent.press(itemComp);

    expect(onPress).toBeCalled();
  });

  it('renders correctly testID', () => {
    const rendered = render(<SettingItem {...baseProps} testID="test" />);

    const { getByTestId } = rendered;
    const itemComponent = getByTestId('test');
    expect(itemComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should show SettingItem disabled', () => {
    const rendered = render(
      <SettingItem {...baseProps} isTouchDisabled />,
    );

    const component = rendered.getByTestId('edit_user_info.setting_item');

    expect(component.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should render left, right component', () => {
    const rendered = renderWithRedux(
      <SettingItem
        {...baseProps}
        privacyIcon="AngleDown"
        leftIcon="AngleDown"
      />,
    );

    const leftComponent = rendered.getByTestId(
      'edit_user_info.setting_item.left_component',
    );

    expect(leftComponent).toBeDefined();

    const rightComponent = rendered.getByTestId(
      'edit_user_info.setting_item.right_component',
    );

    expect(rightComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('render without leftIcon', () => {
    const rendered = render(<SettingItem {...baseProps} leftIcon={undefined} />);

    const leftComponent = rendered.queryByTestId(
      'edit_user_info.setting_item.left_component',
    );
    expect(leftComponent).toBeNull();
  });
});
