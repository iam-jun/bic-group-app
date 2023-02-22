import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import ItemExperience from './index';
import groupApi from '~/api/GroupApi';
import { responseDeleteWorkExperience } from '../../store/__mocks__/data';

describe('ItemExperience component', () => {
  const item = {
    company: 'Test',
    currentlyWorkHere: true,
    description: 'Test',
    endDate: null,
    id: '626959a8-09db-41d2-b8e3-45b525ee2587',
    location: 'An Giang',
    startDate: '2023-02-12T17:00:00.000Z',
    titlePosition: 'Test',
  };

  it('renders correctly', () => {
    const spyApiDeleteWorkExperience = jest
      .spyOn(groupApi, 'deleteWorkExperience')
      .mockImplementation(() => Promise.resolve(responseDeleteWorkExperience) as any);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<ItemExperience item={item} isCurrentUser />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('item_experience');
    expect(containerComponent).toBeDefined();

    const deleteBtn = getByTestId('item_experience.delete_btn');
    fireEvent.press(deleteBtn);
    expect(spyApiDeleteWorkExperience).toBeCalled();

    const editBtn = getByTestId('item_experience.edit_btn');
    fireEvent.press(editBtn);
    expect(navigate).toBeCalled();
  });
});
