import React from 'react';

import { render, cleanup } from '@testing-library/react-native';
import { fireEvent } from '~/test/testUtils';

import OptionMenu from './OptionMenu';

afterEach(cleanup);

describe('OptionMenu conponent', () => {
  const baseProps = {
    data: [
      { title: 'settings:text_male', type: 'MALE' },
      { title: 'settings:text_female', type: 'FEMALE' },
      { title: 'settings:text_others', type: 'OTHERS' },
    ],
    value: 'FEMALE',
    menuRef: null,
    title: 'settings:title_choose_gender',
  };

  it('should call props onItemPress', () => {
    const onGenderItemPress = jest.fn();

    const rendered = render(
      <OptionMenu {...baseProps} onItemPress={onGenderItemPress} />,
    );

    const btnOpenBottomSheetCom = rendered.getByTestId(
      'edit_user_info.option_menu.item_MALE',
    );
    expect(btnOpenBottomSheetCom).toBeDefined();
    fireEvent.press(btnOpenBottomSheetCom);

    expect(onGenderItemPress).toHaveBeenCalledWith({
      title: 'settings:text_male',
      type: 'MALE',
    });
  });
});
