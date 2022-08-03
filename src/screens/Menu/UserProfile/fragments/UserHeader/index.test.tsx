import { render } from '@testing-library/react-native';
import * as React from 'react';

import UserHeader from '.';

describe('UserHeader component', () => {
  const baseProps = {
    fullname: 'fullname',
    username: 'username',
    description: 'description',
    latestWork: {
      titlePosition: 'titlePosition',
      company: 'company',
    },
  }

  it('renders correctly', () => {
    const rendered = render(<UserHeader {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should hide username when username is empty ', () => {
    const props = { ...baseProps, username: '' }
    const { queryByTestId } = render(<UserHeader {...props} />);

    const usernameText = queryByTestId('user_profile.username');

    expect(usernameText).toBeNull();
  });

  it('should hide description when description is empty ', () => {
    const props = { ...baseProps, description: '' }
    const { queryByTestId } = render(<UserHeader {...props} />);

    const descriptionText = queryByTestId('user_profile.description');

    expect(descriptionText).toBeNull();
  });
});
