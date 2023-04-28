import React from 'react';

import { renderWithRedux, cleanup, fireEvent } from '~/test/testUtils';

import LanguageOptionMenuItem from './LanguageOptionMenuItem';

afterEach(cleanup);

describe('LanguageOptionMenuItem conponent', () => {
  const mockLanguage = { code: 'en', local: 'English', selected: true };

  it('should render correctly when not set language', () => {
    const onSelectItem = jest.fn();

    const rendered = renderWithRedux(
      <LanguageOptionMenuItem language={mockLanguage} onChoose={onSelectItem} />,
    );

    const component = rendered.getByTestId('language_option.item_list');
    expect(component).toBeDefined();
    fireEvent.press(component);
    expect(onSelectItem).toHaveBeenCalledWith(mockLanguage);

    const textCom = rendered.getByTestId('language_option.item_list.text');
    expect(textCom).toBeDefined();
    expect(textCom.children?.[0]).toEqual(mockLanguage.local);
  });
});
