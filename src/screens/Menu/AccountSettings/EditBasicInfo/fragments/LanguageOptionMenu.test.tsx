import React from 'react';

import { renderWithRedux, cleanup, fireEvent } from '~/test/testUtils';

import LanguageOptionMenu from './LanguageOptionMenu';
import i18n from '~/localization';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';

afterEach(cleanup);

describe('LanguageOptionMenu conponent', () => {
  const languageState = ['en', 'vi'];
  const mockLanguages = [
    { code: 'en', local: 'English', selected: true },
    { code: 'vi', local: 'Tiếng Việt', selected: true },
  ];
  it('should render correctly when language was not set', () => {
    const onChagneLanguage = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenu
        onChangeLanguages={onChagneLanguage}
        selectedLanguages={[]}
      />,
    );

    const buttonComponent = rendered.getByTestId('edit_basic_info.language');
    expect(buttonComponent).toBeDefined();

    const buttonText = rendered.getByTestId('edit_basic_info.language.title');
    expect(buttonText).toBeDefined();
    expect(buttonText.children?.[0]).toEqual(
      i18n.t('settings:select_language'),
    );

    fireEvent.press(buttonComponent);

    const bottomSheet = rendered.queryByTestId('language.bottom_sheet');
    expect(bottomSheet).toBeDefined();
  });

  it('should render correctly when language was set', () => {
    useUserProfileStore.setState((state) => {
      state.languages = mockLanguages;
      return state;
    });
    const onChagneLanguage = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenu
        onChangeLanguages={onChagneLanguage}
        selectedLanguages={languageState}
      />,
    );

    const buttonComponent = rendered.getByTestId('edit_basic_info.language');
    expect(buttonComponent).toBeDefined();

    const selectedItemsCom = rendered.getAllByTestId(
      'edit_basic_info.language.selected_item',
    );
    expect(selectedItemsCom.length).toEqual(languageState.length);
    const selectedTagRemoveItems = rendered.getAllByTestId('tag.icon');
    fireEvent.press(selectedTagRemoveItems[0]);
    expect(onChagneLanguage).toHaveBeenCalled();

    fireEvent.press(buttonComponent);

    const bottomSheet = rendered.queryByTestId('language.bottom_sheet');
    expect(bottomSheet).toBeDefined();
  });
});
