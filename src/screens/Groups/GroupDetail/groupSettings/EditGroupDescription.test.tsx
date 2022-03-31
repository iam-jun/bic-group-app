import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import EditGroupDescription from './EditGroupDescription';
import {groupDetailData} from '~/test/mock_data/group';

describe('EditGroupDescription component', () => {
  const component = () => (
    <EditGroupDescription
      route={{params: {groupId: groupDetailData.group.id}}}
    />
  );

  it('change text description correctly', () => {
    const {getByTestId} = renderWithRedux(
      <MockedNavigator component={component} />,
    );

    const inputItem = getByTestId('edit_group_description.text');
    expect(inputItem).toBeDefined();
    fireEvent.changeText(inputItem, 'Test description');
    expect(inputItem.props.value).toBe('Test description');
  });

  it('renders button Save correctly', () => {
    const {getByTestId} = renderWithRedux(
      <MockedNavigator component={component} />,
    );

    const buttonComponent = getByTestId('header.button');
    expect(buttonComponent).toBeDefined();
    fireEvent.press(buttonComponent);
  });
});
