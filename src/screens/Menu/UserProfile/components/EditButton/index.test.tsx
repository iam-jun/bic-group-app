import React from 'react';
import { IconType } from '~/resources/icons';
import { renderWithRedux } from '~/test/testUtils';
import EditButton from './index';

describe('EditButton component', () => {
  const props = {
    icon: 'PenToSquareSolid' as IconType,
    isCurrentUser: true,
    onPress: jest.fn(),
    style: undefined,
    testID: 'test',
  };

  it('should render props correctly', () => {
    const isCurrentUser = true;

    const rendered = renderWithRedux(
      <EditButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
      />,
    );

    const { getByTestId } = rendered;
    const editBtn = getByTestId(props.testID);
    expect(editBtn).toBeDefined();
  });

  it('should not render', () => {
    const isCurrentUser = false;

    const rendered = renderWithRedux(
      <EditButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
      />,
    );

    const { queryByTestId } = rendered;
    const editBtn = queryByTestId(props.testID);
    expect(editBtn).toBeNull();
  });
});
