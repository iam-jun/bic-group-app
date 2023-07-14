import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import ShowingBadges from './ShowingBadges';
import useUserBadge from '../../fragments/BadgeCollection/store';

describe('ShowingBadges component', () => {
  it('should render item without icon remove badge', () => {
    const choosingBadges = [
      {
        id: 'a8cbf951-a51e-49ea-9aa5-1c1c3914567',
        name: 'test badge',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      },
      {
        id: 'bd2989d8-6c47-45f0-8c04-785869c86655',
        name: 'test badge 2',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      },
      {
        id: 'a34f9543-ec3f-47c0-aecb-d8ac8f6e6f513',
        name: 'test badge 3',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      },
    ];
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <ShowingBadges />,
    );

    const { getAllByTestId, queryAllByTestId } = rendered;
    const showingBadges = getAllByTestId('showing_badges.item');
    expect(showingBadges).toBeDefined();
    expect(showingBadges.length).toBe(3);

    const buttonRemoves = queryAllByTestId('showing_badges.item.button_remove');
    expect(buttonRemoves.length).toBe(0);
  });

  it('should render item with icon remove badge if is edit mode and should render empty item if item is undefined', () => {
    const choosingBadges = [
      {
        id: 'a8cbf951-a51e-49ea-9aa5-1c1c3914567',
        name: 'test badge',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      },
      undefined,
      undefined,
    ];

    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = true;
      return state;
    });

    const rendered = renderWithRedux(
      <ShowingBadges isShowEditButton />,
    );

    const { getAllByTestId } = rendered;
    const showingBadges = getAllByTestId('showing_badges.item');
    expect(showingBadges).toBeDefined();
    expect(showingBadges.length).toBe(1);

    const showingEmptyBadges = getAllByTestId('showing_badges.empty_item');
    expect(showingEmptyBadges).toBeDefined();
    expect(showingEmptyBadges.length).toEqual(2);
  });
});
