import React from 'react';

import { renderWithRedux, cleanup, fireEvent } from '~/test/testUtils';

import LanguageOptionMenu from './LanguageOptionMenu';

afterEach(cleanup);

describe('LanguageOptionMenu conponent', () => {
  const languageState = ['vi', 'en'];

  it('should call props onChangeLanguages', () => {
    const onChagneLanguage = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenu
        onChangeLanguages={onChagneLanguage}
        selectedLanguages={languageState}
      />,
    );

    const btnOpenBottomSheetCom = rendered.getByTestId(
      'edit_basic_info.language',
    );
    expect(btnOpenBottomSheetCom).toBeDefined();
    fireEvent.press(btnOpenBottomSheetCom);

    const btnSaveComponent = rendered.getByTestId(
      'edit_basic_info.save_language',
    );
    expect(btnSaveComponent).toBeDefined();
    fireEvent.press(btnSaveComponent);

    expect(onChagneLanguage).toBeCalled();
  });

  it('should call props onChangeLanguages with list language', () => {
    const onChagneLanguage = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenu
        onChangeLanguages={onChagneLanguage}
        selectedLanguages={[]}
      />,
    );

    const btnOpenBottomSheetCom = rendered.getByTestId(
      'edit_basic_info.language',
    );
    expect(btnOpenBottomSheetCom).toBeDefined();
    fireEvent.press(btnOpenBottomSheetCom);

    const item0Component = rendered.getByTestId(
      'language_option_menu.checkbox.item_0',
    );
    expect(item0Component).toBeDefined();

    fireEvent.press(item0Component);

    const btnSaveComponent = rendered.getByTestId(
      'edit_basic_info.save_language',
    );
    expect(btnSaveComponent).toBeDefined();
    fireEvent.press(btnSaveComponent);

    expect(onChagneLanguage).toHaveBeenCalledWith(['vi']);
  });
});
