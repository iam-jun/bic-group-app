import React from 'react';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import MemberOptionsMenu from './MemberOptionsMenu';

describe('MemberOptionsMenu component', () => {
  const baseSheetRef = jest.fn();
  const groupId = 1;
  const onOptionsClosed = jest.fn();

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        onOptionsClosed={onOptionsClosed}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders leave group option correctly', () => {
    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        onOptionsClosed={onOptionsClosed}
      />,
    );
    const itemComponent = getByTestId('member_options_menu.leave_group');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });
});
