import React from 'react';
import { IconType } from '~/resources/icons';
import { renderWithRedux } from '~/test/testUtils';
import DeleteButton from './index';

describe('DeleteButton component', () => {
  const props = {
    icon: 'TrashCanSolid' as IconType,
    isCurrentUser: true,
    onPress: jest.fn(),
    style: undefined,
    testID: 'item_experience.delete_btn',
  };

  it('should render props correctly', () => {
    const isCurrentUser = true;

    const rendered = renderWithRedux(
      <DeleteButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
      />,
    );

    const { getByTestId } = rendered;
    const deleteBtn = getByTestId(props.testID);
    expect(deleteBtn).toBeDefined();
  });

  it('should not render', () => {
    const isCurrentUser = false;

    const rendered = renderWithRedux(
      <DeleteButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
      />,
    );

    const { queryByTestId } = rendered;
    const deleteBtn = queryByTestId(props.testID);
    expect(deleteBtn).toBeNull();
  });
});
