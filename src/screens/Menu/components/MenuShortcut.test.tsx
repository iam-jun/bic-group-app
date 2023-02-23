import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MenuShortcut from './MenuShortcut';
import * as navigationHook from '~/hooks/navigation';
import modalActions from '~/storeRedux/modal/actions';

describe('MenuShortcut component', () => {
  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const spy = jest.spyOn(modalActions, 'showAlertNewFeature');

    const rendered = renderWithRedux(<MenuShortcut />);
    const { getByTestId } = rendered;
    const component = getByTestId('menu_shortcut');
    expect(component).toBeDefined();

    const writePostBtn = getByTestId('menu_shortcut.PenLineSolid_btn');
    fireEvent.press(writePostBtn);
    const writeArticleBtn = getByTestId('menu_shortcut.FilePenSolid_btn');
    fireEvent.press(writeArticleBtn);
    const writeSeriesBtn = getByTestId('menu_shortcut.AlbumCollectionSolid_btn');
    fireEvent.press(writeSeriesBtn);
    const draftBtn = getByTestId('menu_shortcut.FloppyDiskPenSolid_btn');
    fireEvent.press(draftBtn);
    const yourContentBtn = getByTestId('menu_shortcut.BallotCheckSolid_btn');
    fireEvent.press(yourContentBtn);
    expect(navigate).toBeCalled();

    const savedItemsBtn = getByTestId('menu_shortcut.BookmarkSolid_btn');
    fireEvent.press(savedItemsBtn);
    expect(spy).toBeCalled();
  });
});
