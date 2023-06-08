import React from 'react';

import { render } from '~/test/testUtils';
import UserBadgeItem from './UserBadgeItem';

describe('UserBadgeItem component', () => {
  const fakeBadgeData = {
    id: '322472ea-5ce9-4518-b93f-79d3bd6dced2',
    community: {
      id: '656cebfe-1b91-473f-97fd-96837bf9e2a5',
      name: 'Community của Bảo gất là dễ thương nuônnnnnnnnnnnnnn',
    },
    iconUrl: 'https://media.beincom.io/image/variants/badge/6452e17b-7de4-4ba2-a0e1-fa01e687a610',
    name: 'Community Builder',
  };

  it('renders correctly', () => {
    const rendered = render(<UserBadgeItem
      data={fakeBadgeData}
    />);

    const component = rendered.getByTestId('user_badge_item');
    expect(component).toBeDefined();
  });

  it('renders null if data.id is null', () => {
    const rendered = render(<UserBadgeItem
      data={{ ...fakeBadgeData, id: null }}
    />);

    const component = rendered.queryByTestId('user_badge_item');
    expect(component).toBeNull();
  });
});
