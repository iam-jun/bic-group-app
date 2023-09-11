import React from 'react';
import { render } from '@testing-library/react-native';
import NoOneIsInvited, { NoOneIsInvitedProps } from './NoOneIsInvited';
import { ITypeGroup } from '~/interfaces/common';

describe('NoOneIsInvited', () => {
  it('renders correctly', () => {
    const props: NoOneIsInvitedProps = {
      groupId: 'test',
      type: ITypeGroup.GROUP,
    };

    const { getByTestId } = render(<NoOneIsInvited {...props} />);
    expect(getByTestId('no_one_is_invited')).toBeDefined();
  });
});
