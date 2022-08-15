import { cleanup } from '@testing-library/react-native';
import React from 'react';
import menuActions from '../../../../../storeRedux/menu/actions';
import menuTypes from '../../../../../storeRedux/menu/types';
import initialState from '~/storeRedux/initialState';
import { USER_PROFILE } from '~/test/mock_data/menu';
import { createTestStore, renderWithRedux } from '~/test/testUtils';
import Experiences from '.';

afterEach(cleanup);

describe('Experiences screen', () => {
  const data = [
    {
      id: '1',
      company: 'company',
      titlePosition: 'titlePosition',
      startDate: '2022-03-07T07:58:05.436Z',
      currentlyWorkHere: true,
      endDate: null,
      location: 'location',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
    storeData.menu.userWorkExperience = [];
  });

  let storeData: any;

  it('renders correctly', () => {
    const mockActionGetUserWorkExperience = () => ({
      type: menuTypes.SET_USER_PROFILE,
      payload: USER_PROFILE,
    });

    jest
      .spyOn(menuActions, 'getUserWorkExperience')
      .mockImplementation(mockActionGetUserWorkExperience as any);

    storeData.menu.userWorkExperience = data;

    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<Experiences />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders null', () => {
    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<Experiences />, store);
    expect(wrapper).toMatchSnapshot();
  })
});
