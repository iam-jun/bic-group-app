import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import ShowingBadgesItem from './ShowingBadgesItem';
import useUserBadge, { IUserBadgesState } from '../../fragments/BadgeCollection/store';

describe('ShowingBadgesItem component', () => {
  const fakeBadgeData = {
    id: '322472ea-5ce9-4518-b93f-79d3bd6dced2',
    iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
    name: 'Community Builder',
  };

  it('renders correctly if item is not empty', () => {
    const removeChoosingBadges = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [fakeBadgeData, undefined, undefined];
      state.actions.removeChoosingBadges = removeChoosingBadges;
      return state;
    });

    const index = 0;
    const rendered = render(<ShowingBadgesItem
      index={index}
      isShowEditButton={false}
    />);

    const itemsComponent = rendered.getByTestId('showing_badges.item');
    expect(itemsComponent).toBeDefined();

    const removeButtonComponent = rendered.queryByTestId('showing_badges.item.button_remove');
    expect(removeButtonComponent).toBeNull();
  });

  it('renders correctly if item is not empty and in edit mode', () => {
    const removeChoosingBadges = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [fakeBadgeData, undefined, undefined];
      state.actions.removeChoosingBadges = removeChoosingBadges;
      return state;
    });

    const index = 0;
    const rendered = render(<ShowingBadgesItem
      index={index}
      isShowEditButton
    />);

    const itemsComponent = rendered.queryByTestId('showing_badges.item');
    expect(itemsComponent).toBeDefined();

    const removeButtonComponent = rendered.queryByTestId('showing_badges.item.button_remove');
    expect(removeButtonComponent).toBeDefined();

    fireEvent.press(removeButtonComponent);
    expect(removeChoosingBadges).toBeCalledWith(index);
  });

  it('renders correctly if item is empty', () => {
    const removeChoosingBadges = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [undefined, undefined, undefined];
      state.actions.removeChoosingBadges = removeChoosingBadges;
      return state;
    });

    const index = 0;
    const rendered = render(<ShowingBadgesItem
      index={index}
      isShowEditButton
    />);

    const itemEmptysComponent = rendered.queryByTestId('showing_badges.empty_item');
    expect(itemEmptysComponent).toBeDefined();
  });
});
