import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BadgeCollectionHeader from './BadgeCollectionHeader';
import useUserBadge from './store';

describe('BadgeCollectionHeader component', () => {
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

  const totalBadges = 10;
  it('should render correctly without props', () => {
    const setIsEditing = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = false;
      state.totalBadges = totalBadges;
      state.actions.setIsEditing = setIsEditing;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollectionHeader />,
    );

    const { getByTestId } = rendered;
    const buttonEdit = getByTestId('badge_collection_header.edit_btn');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);
    expect(setIsEditing).toHaveBeenCalled();

    const totalBadgesComp = getByTestId('badge_collection_header.total_badges');
    expect(totalBadgesComp).toBeDefined();
    expect(totalBadgesComp.props?.children).toEqual(' (10 badges)');
  });

  it('should render correctly with isShowEditButton=true and is edit mode = true', () => {
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = true;
      state.totalBadges = totalBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollectionHeader isShowEditButton />,
    );

    const { getByTestId, queryByTestId } = rendered;

    const buttonEdit = queryByTestId('badge_collection_header.edit_btn');
    expect(buttonEdit).toBeNull();

    const totalBadgesComp = getByTestId('badge_collection_header.total_badges');
    expect(totalBadgesComp).toBeDefined();
    expect(totalBadgesComp.props?.children).toEqual(' (10 badges)');
  });
});
