import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import UserBadge from './index';

describe('UserBadge component', () => {
  it('renders correctly when showingBadges value length = 1', () => {
    const showingBadges = [{
      id: '322472ea-5ce9-4518-b93f-79d3bd6dced2',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
        name: 'Community của Bảo gất là dễ thương nuônnnnnnnnnnnnnn',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder',
    }, undefined, undefined];
    const onPress = jest.fn();
    const rendered = render(<UserBadge
      showingBadges={showingBadges}
      onPress={onPress}
    />);

    const badgeItem = rendered.getAllByTestId('user_badge_item');
    expect(badgeItem).toBeDefined();
    expect(badgeItem.length).toEqual(1);

    const emptyItem = rendered.getAllByTestId('user_badge_item.empty');
    expect(emptyItem).toBeDefined();
    expect(emptyItem.length).toEqual(2);

    fireEvent.press(emptyItem[0]);
    expect(onPress).toHaveBeenCalled();
  });

  it('renders correctly when showingBadges value length = 2', () => {
    const showingBadges = [{
      id: '322472ea-5ce9-4518-b93f-79d3bd6dced2',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
        name: 'Community của Bảo gất là dễ thương nuônnnnnnnnnnnnnn',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder',
    }, {
      id: '322472ea-5ce9-4518-b93f-79d3bd6dce32',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837bf9e6a5',
        name: 'Community của Bảo g',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder 123',
    },
    undefined];
    const onPress = jest.fn();
    const rendered = render(<UserBadge
      showingBadges={showingBadges}
      onPress={onPress}
    />);

    const badgeItem = rendered.getAllByTestId('user_badge_item');
    expect(badgeItem).toBeDefined();
    expect(badgeItem.length).toEqual(2);

    const emptyItem = rendered.getAllByTestId('user_badge_item.empty');
    expect(emptyItem).toBeDefined();
    expect(emptyItem.length).toEqual(1);

    fireEvent.press(emptyItem[0]);
    expect(onPress).toHaveBeenCalled();
  });

  it('renders correctly when showingBadges value length = 3', () => {
    const showingBadges = [{
      id: '322472ea-5ce9-4518-b93f-79d3bd6dced2',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
        name: 'Community của Bảo gất là dễ thương nuônnnnnnnnnnnnnn',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder',
    }, {
      id: '322472ea-5ce9-4518-b93f-79d3bd6dce32',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837bf9e6a5',
        name: 'Community của Bảo g',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder 123',
    },
    {
      id: '322472ea-5ce9-4518-b93f-79d3bd6dce222',
      community: {
        id: '656cebfe-1b91-473f-97fd-96837b43f9e6a5',
        name: 'Community của Bảo g',
      },
      iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
      name: 'Community Builder 2',
    }];
    const onPress = jest.fn();
    const rendered = render(<UserBadge
      showingBadges={showingBadges}
      onPress={onPress}
    />);

    const badgeItem = rendered.getAllByTestId('user_badge_item');
    expect(badgeItem).toBeDefined();
    expect(badgeItem.length).toEqual(3);

    const emptyItem = rendered.queryAllByTestId('user_badge_item.empty');
    expect(emptyItem.length).toEqual(0);

    const btnEdit = rendered.getAllByTestId('user_badge_item.button_edit');
    expect(btnEdit).toBeDefined();

    expect(onPress).toHaveBeenCalled();
  });
});
