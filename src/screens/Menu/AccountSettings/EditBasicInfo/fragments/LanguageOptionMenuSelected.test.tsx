import React from 'react';

import { renderWithRedux, cleanup, fireEvent } from '~/test/testUtils';

import LanguageOptionMenuSelected from './LanguageOptionMenuSelected';
import i18n from '~/localization';

afterEach(cleanup);

describe('LanguageOptionMenuSelected conponent', () => {
  const languages = [
    { code: 'en', local: 'English', selected: true },
    { code: 'vi', local: 'Tiếng Việt', selected: true },
  ];

  it('should render correctly when not set language', () => {
    const onRemove = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenuSelected onRemove={onRemove} languages={[]} />,
    );

    const component = rendered.getByTestId('button.text');
    expect(component).toBeDefined();
    expect(component.children?.[0]).toEqual(i18n.t('common:text_not_set'));
  });

  it('should render correctly when language was set', () => {
    const onRemove = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenuSelected onRemove={onRemove} languages={languages} />,
    );

    const component = rendered.getByTestId('button.selected_languages');
    expect(component).toBeDefined();

    const languageItemCom = rendered.queryAllByTestId('tag.item');
    expect(languageItemCom).toBeDefined();
    expect(languageItemCom.length).toEqual(languages.length);

    const languageItemRemoveCom = rendered.queryAllByTestId('tag.icon');
    fireEvent.press(languageItemRemoveCom[0]);
    expect(onRemove).toHaveBeenCalledWith(languages[0]);

    const buttonRemoveCom = rendered.queryByTestId('button.remove');
    expect(buttonRemoveCom).toBeDefined();
    fireEvent.press(buttonRemoveCom);
    expect(onRemove).toHaveBeenCalled();
  });
});
