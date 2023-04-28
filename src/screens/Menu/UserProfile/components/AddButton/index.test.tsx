import React from 'react';
import { IconType } from '~/resources/icons';
import { renderWithRedux } from '~/test/testUtils';
import AddButton from './index';

describe('AddButton component', () => {
  const props = {
    icon: 'PlusSolid' as IconType,
    onPress: jest.fn(),
    style: undefined,
    testID: 'experiences.add_btn',
    title: 'common:text_add',
  };

  it('should render props correctly', () => {
    const isCurrentUser = true;

    const rendered = renderWithRedux(
      <AddButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
        title={props.title}
      />,
    );

    const { getByTestId } = rendered;
    const addBtn = getByTestId(props.testID);
    expect(addBtn).toBeDefined();
  });

  it('should not render', () => {
    const isCurrentUser = false;

    const rendered = renderWithRedux(
      <AddButton
        style={props.style}
        testID={props.testID}
        isCurrentUser={isCurrentUser}
        onPress={props.onPress}
        icon={props.icon}
        title={props.title}
      />,
    );

    const { queryByTestId } = rendered;
    const addBtn = queryByTestId(props.testID);
    expect(addBtn).toBeNull();
  });
});
