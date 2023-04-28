import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Experiences from './index';
import * as navigationHook from '~/hooks/navigation';
import useUserProfileStore, { IUserProfileState } from '../../store';
import { responseGetWorkExperience } from '../../store/__mocks__/data';

describe('Experiences component', () => {
  it('renders correctly', () => {
    useUserProfileStore.setState((state: IUserProfileState) => {
      state.userWorkExperience = responseGetWorkExperience.data;
      return state;
    });

    const baseProps = {
      isCurrentUser: true,
    };

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<Experiences {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('experiences');
    expect(containerComponent).toBeDefined();

    const addBtn = getByTestId('experiences.add_btn');
    fireEvent.press(addBtn);
    expect(navigate).toBeCalled();
  });

  it('should not render', () => {
    const baseProps = {
      isCurrentUser: false,
    };

    const rendered = renderWithRedux(<Experiences {...baseProps} />);
    const { queryByTestId } = rendered;
    const addBtn = queryByTestId('experiences');
    expect(addBtn).toBeNull();
  });
});
