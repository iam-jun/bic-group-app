import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import EditGroupDescription from './EditGroupDescription';
import {groupDetailData} from '~/test/mock_data/group';
import groupsActions from '~/screens/Groups/redux/actions';

describe('EditGroupDescription component', () => {
  const component = () => (
    <EditGroupDescription
      route={{params: {groupId: groupDetailData.group.id}}}
    />
  );

  it('renders button Save correctly', () => {
    const {getByTestId} = renderWithRedux(
      <MockedNavigator component={component} />,
    );

    const buttonComponent = getByTestId('header.button');
    expect(buttonComponent).toBeDefined();
  });

  it('should dispatch edit group detail when press save', () => {
    const spy = jest.spyOn(groupsActions, 'editGroupDetail');

    const {getByTestId} = renderWithRedux(
      <MockedNavigator component={component} />,
    );

    const inputItem = getByTestId('edit_group_description.text');
    expect(inputItem).toBeDefined();
    fireEvent.changeText(inputItem, 'Test description');

    const buttonComponent = getByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        data: {description: 'Test description', id: undefined},
      }),
    );
  });
});
