import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import MenuShortcut from './MenuShortcut';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import i18n from '~/localization';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

describe('MenuShortcut component', () => {
  it('renders correctly', () => {
    const rendered = render(<MenuShortcut />);
    const itemsComponent = rendered.getAllByTestId('menu_shortcut.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(4);
  });

  it('should navigate to select audience screen when click item write post', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuShortcut />);
    const itemsComponent = rendered.getAllByTestId('menu_shortcut.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toBeGreaterThanOrEqual(4);

    expect(itemsComponent[0]).toBeDefined();
    fireEvent.press(itemsComponent[0]);

    const itemText = rendered.getAllByTestId('menu_shortcut.item.text')?.[0];
    expect(itemText.props?.children).toEqual(i18n.t('menu:title_write_post'));

    expect(navigate).toHaveBeenCalledWith(homeStack.postSelectAudience, { isFirstStep: true });
  });

  it('should navigate to create article screen when click item write article', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuShortcut />);
    const itemsComponent = rendered.getAllByTestId('menu_shortcut.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toBeGreaterThanOrEqual(4);

    expect(itemsComponent[1]).toBeDefined();
    fireEvent.press(itemsComponent[1]);

    const itemText = rendered.getAllByTestId('menu_shortcut.item.text')?.[1];
    expect(itemText.props?.children).toEqual(i18n.t('menu:title_write_article'));

    expect(navigate).toHaveBeenCalledWith(articleStack.createArticle, { isFirstStep: true });
  });

  it('should navigate to draft screen when click item your draft', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuShortcut />);
    const itemsComponent = rendered.getAllByTestId('menu_shortcut.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toBeGreaterThanOrEqual(4);

    expect(itemsComponent[2]).toBeDefined();
    fireEvent.press(itemsComponent[2]);

    const itemText = rendered.getAllByTestId('menu_shortcut.item.text')?.[2];
    expect(itemText.props?.children).toEqual(i18n.t('menu:title_draft'));

    expect(navigate).toHaveBeenCalledWith(menuStack.draft);
  });
  it('should navigate to your content screen when click item your content', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuShortcut />);
    const itemsComponent = rendered.getAllByTestId('menu_shortcut.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toBeGreaterThanOrEqual(4);

    expect(itemsComponent[3]).toBeDefined();
    fireEvent.press(itemsComponent[3]);

    const itemText = rendered.getAllByTestId('menu_shortcut.item.text')?.[3];
    expect(itemText.props?.children).toEqual(i18n.t('menu:title_your_content'));

    expect(navigate).toHaveBeenCalledWith(menuStack.yourContent);
  });
});
