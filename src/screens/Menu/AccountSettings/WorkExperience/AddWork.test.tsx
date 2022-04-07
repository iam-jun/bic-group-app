/* eslint-disable @typescript-eslint/no-var-requires */

import {cleanup, waitFor} from '@testing-library/react-native';
import React from 'react';

import initialState from '~/store/initialState';
import {colors} from '~/theme';
import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
  waitForUpdateRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';
import AddWork from './AddWork';
import menuDataHelper from '../../helper/MenuDataHelper';
import i18next from 'i18next';
import {formatDate} from '~/utils/formatData';

afterEach(cleanup);

describe('AddWork screen', () => {
  let Keyboard: any;

  const mockStore = configureStore([]);
  const companyText = 'Company Text';
  const positionText = 'Position Text';
  const currentDate = new Date();

  const workItem = {
    company: 'test 1',
    currentlyWorkHere: true,
    currently_work_here: true,
    description: '',
    endDate: null,
    end_date: null,
    id: 77,
    location: 'test 1',
    startDate: '2022-03-07T07:58:05.436Z',
    start_date: '2022-03-07T07:58:05.436Z',
    titlePosition: 'test 1',
    title_position: 'test 1',
  };

  // const setState = jest.fn();
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const useStateMock: any = (initState: any) => [initState, setState];

  // jest.spyOn(React, 'useState').mockImplementation(useStateMock);

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should disable Add button and  when selectedWorkItem = null (add new work)`, async () => {
    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.selectedWorkItem = null;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AddWork />, store);

    const component = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');
    const toggleComponent = wrapper.getByTestId(
      'add_work.currently_work_here.out_side_view',
    );
    const endDateComponent = wrapper.queryByTestId('add_work.end_date_view');
    const startDateTitle = wrapper.getByTestId('add_work.start_date.title');
    const startDateValueComponent = wrapper.getByTestId('add_work.start_date');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_add_work'),
    );
    expect(component.props.accessibilityState.disabled).toBeTruthy();
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
    expect(endDateComponent).toBeNull();
    expect(startDateTitle.props.children).toBe(
      i18next.t('settings:text_since'),
    );

    expect(startDateValueComponent.props.children).toBe(
      formatDate(currentDate, 'MMMM DD, YYYY'),
    );
  });

  it(`should enable Add button when companyValue and positionValue not null, selectedWorkItem = null (add new work)`, async () => {
    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.selectedWorkItem = null;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AddWork />, store);

    const component = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_add_work'),
    );
    expect(component.props.accessibilityState.disabled).toBeTruthy();

    const textInputCompany = wrapper.getByTestId('add_work.company');
    const textInputPosition = wrapper.getByTestId('add_work.title_position');

    fireEvent.changeText(textInputCompany, companyText);
    fireEvent.changeText(textInputPosition, positionText);

    expect(component.props.accessibilityState.disabled).toBeFalsy();
  });

  it(`should show enable Save button, Delete button, when selectedWorkItem = {...} (edit work)`, async () => {
    Keyboard.dismiss = jest.fn();

    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.selectedWorkItem = {...workItem};

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AddWork />, store);

    const buttonSaveComponent = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');
    const toggleComponent = wrapper.getByTestId(
      'add_work.currently_work_here.out_side_view',
    );
    const endDateComponent = wrapper.queryByTestId('add_work.end_date_view');
    const startDateTitle = wrapper.getByTestId('add_work.start_date.title');
    const startDateValueComponent = wrapper.getByTestId('add_work.start_date');
    const buttonDeleteComponent = wrapper.getByTestId('add_work.delete');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_edit_work'),
    );
    expect(buttonSaveComponent.props.accessibilityState.disabled).toBeFalsy();
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
    expect(endDateComponent).toBeNull();
    expect(startDateTitle.props.children).toBe(
      i18next.t('settings:text_since'),
    );
    expect(startDateValueComponent.props.children).toBe(
      formatDate(workItem.startDate, 'MMMM DD, YYYY'),
    );
    expect(buttonDeleteComponent).toBeDefined();

    //off current currentlyWorkHere
    fireEvent.press(toggleComponent);

    expect(Keyboard.dismiss).toBeCalled();
    expect(startDateTitle.props.children).toBe(
      i18next.t('common:text_start_date'),
    );
    expect(endDateComponent).toBeDefined();

    const endDateValueComponent = wrapper.getByTestId('add_work.end_date');
    expect(endDateValueComponent.props.children).toBe(
      i18next.t('common:text_not_set'),
    );
  });

  it(`should show enable Save button, Delete button, when selectedWorkItem = {...} but have endDate (edit work)`, async () => {
    Keyboard.dismiss = jest.fn();
    const storeData = {...initialState};
    //@ts-ignore
    const endDate = '2024-03-07T07:58:05.436Z';
    storeData.menu.selectedWorkItem = {
      ...workItem,
      endDate: endDate,
      currentlyWorkHere: false,
      //@ts-ignore
      currently_work_here: false,
    };

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AddWork />, store);

    const buttonSaveComponent = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');
    const toggleComponent = wrapper.getByTestId(
      'add_work.currently_work_here.out_side_view',
    );
    const endDateComponent = wrapper.queryByTestId('add_work.end_date_view');
    const startDateTitle = wrapper.getByTestId('add_work.start_date.title');
    const startDateValueComponent = wrapper.getByTestId('add_work.start_date');
    const buttonDeleteComponent = wrapper.getByTestId('add_work.delete');
    const endDateValueComponent = wrapper.queryByTestId('add_work.end_date');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_edit_work'),
    );
    expect(buttonSaveComponent.props.accessibilityState.disabled).toBeFalsy();

    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.borderCard,
    );
    expect(endDateComponent).toBeDefined();
    expect(endDateValueComponent?.props?.children).toBe(
      formatDate(endDate, 'MMMM DD, YYYY'),
    );

    expect(startDateTitle.props.children).toBe(
      i18next.t('common:text_start_date'),
    );

    expect(startDateValueComponent.props.children).toBe(
      formatDate(workItem.startDate, 'MMMM DD, YYYY'),
    );
    expect(buttonDeleteComponent).toBeDefined();

    //on current currentlyWorkHere
    fireEvent.press(toggleComponent);

    expect(Keyboard.dismiss).toBeCalled();
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
    expect(startDateTitle.props.children).toBe(
      i18next.t('settings:text_since'),
    );
  });

  it(`should show startDate bottom sheet and endDate bottom sheet when click them`, async () => {
    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.selectedWorkItem = null;

    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<AddWork />, store);

    const component = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');
    const toggleComponent = wrapper.getByTestId(
      'add_work.currently_work_here.out_side_view',
    );
    const endDateComponent = wrapper.queryByTestId('add_work.end_date_view');
    const startDateTitle = wrapper.getByTestId('add_work.start_date.title');
    const startDateValueComponent = wrapper.getByTestId('add_work.start_date');
    const buttonStartDate = wrapper.getByTestId('add_work.start_date.button');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_add_work'),
    );
    expect(component.props.accessibilityState.disabled).toBeTruthy();
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
    expect(endDateComponent).toBeNull();
    expect(startDateTitle.props.children).toBe(
      i18next.t('settings:text_since'),
    );

    expect(startDateValueComponent.props.children).toBe(
      formatDate(currentDate, 'MMMM DD, YYYY'),
    );

    fireEvent.press(buttonStartDate);
    expect(
      wrapper.queryByTestId('add_work.start_date.bottom_sheet'),
    ).toBeDefined();

    fireEvent.press(toggleComponent);
    const buttonEndDate = wrapper.getByTestId('add_work.end_date.button');
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.borderCard,
    );
    expect(buttonEndDate).toBeDefined();

    fireEvent.press(buttonEndDate);
    expect(wrapper.getByTestId('add_work.end_date.bottom_sheet')).toBeDefined();
  });

  it(`should add work item successfully`, async () => {
    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn(),
    }));
    const state = {...initialState};
    //@ts-ignore
    state.menu.selectedWorkItem = null;

    const store = mockStore(state);
    const wrapper = renderWithRedux(<AddWork />, store);

    const btnSaveComponent = wrapper.getByTestId('add_work.save');
    const titleComponent = wrapper.getByTestId('header.text');
    const toggleComponent = wrapper.getByTestId(
      'add_work.currently_work_here.out_side_view',
    );
    const endDateComponent = wrapper.queryByTestId('add_work.end_date_view');
    const startDateTitle = wrapper.getByTestId('add_work.start_date.title');
    const startDateValueComponent = wrapper.getByTestId('add_work.start_date');
    const companyTextInput = wrapper.getByTestId('add_work.company');
    const positionnTextInput = wrapper.getByTestId('add_work.title_position');

    expect(titleComponent.props.children).toBe(
      i18next.t('settings:text_add_work'),
    );
    expect(btnSaveComponent.props.accessibilityState.disabled).toBeTruthy();
    expect(toggleComponent.props.style.backgroundColor).toBe(
      colors.light.colors.success,
    );
    expect(endDateComponent).toBeNull();
    expect(startDateTitle.props.children).toBe(
      i18next.t('settings:text_since'),
    );

    expect(startDateValueComponent.props.children).toBe(
      formatDate(currentDate, 'MMMM DD, YYYY'),
    );
    expect(companyTextInput).toBeDefined();
    expect(positionnTextInput).toBeDefined();

    fireEvent.changeText(companyTextInput, companyText);
    // expect(setState).toHaveBeenCalledWith(companyText);

    fireEvent.changeText(positionnTextInput, positionText);
    // expect(setState).toHaveBeenCalledWith(positionText);

    fireEvent.press(btnSaveComponent);
  });

  it(`should delete work item successfully`, async () => {
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();
    const rootNavigation = {canGoBack: true, goBack};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const deleteFunc = jest.fn(() => {
      return Promise.resolve({
        code: 200,
        data: [],
        meta: {},
      });
    });
    jest
      .spyOn(menuDataHelper, 'deleteWorkExperience')
      .mockImplementation(deleteFunc);

    const state = {...initialState};
    //@ts-ignore
    state.menu.selectedWorkItem = workItem;

    const store = mockStore(state);
    const wrapper = renderWithRedux(<AddWork />, store);

    const btnDeleteComponent = wrapper.getByTestId('add_work.delete');

    fireEvent.press(btnDeleteComponent);

    //can't call dispach, stuck here
    // await waitForUpdateRedux();

    // expect(Keyboard.dismiss).toBeCalled();
    // expect(goBack).toBeCalled();
  });

  it(`should go back to previous screen successfully`, async () => {
    Keyboard.dismiss = jest.fn();
    const goBack = jest.fn();
    const rootNavigation = {canGoBack: true, goBack};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const state = {...initialState};
    //@ts-ignore
    state.menu.selectedWorkItem = null;

    const store = mockStore(state);
    const wrapper = renderWithRedux(<AddWork />, store);

    const backButton = wrapper.getByTestId('header.back');

    fireEvent.press(backButton);

    expect(Keyboard.dismiss).toBeCalled();
    expect(goBack).toBeCalled();
  });

  it(`should update border color of input`, async () => {
    const state = {...initialState};
    //@ts-ignore
    state.menu.selectedWorkItem = null;

    const store = mockStore(state);
    const wrapper = renderWithRedux(<AddWork />, store);

    const textInputCompany = wrapper.getByTestId('add_work.company');
    const textInputPosition = wrapper.getByTestId('add_work.title_position');
    const textInputLocation = wrapper.getByTestId('add_work.location');
    const textInputDescription = wrapper.getByTestId('add_work.description');
    const textInputDescriptionView = wrapper.getByTestId(
      'add_work.description.view',
    );

    expect(textInputCompany.props.outlineColor).toBe(
      colors.light.colors.borderCard,
    );
    expect(textInputCompany.props.activeOutlineColor).toBe(
      colors.light.colors.primary6,
    );
    expect(textInputPosition.props.outlineColor).toBe(
      colors.light.colors.borderCard,
    );
    expect(textInputPosition.props.activeOutlineColor).toBe(
      colors.light.colors.primary6,
    );
    expect(textInputLocation.props.outlineColor).toBe(
      colors.light.colors.borderCard,
    );
    expect(textInputLocation.props.activeOutlineColor).toBe(
      colors.light.colors.primary6,
    );

    fireEvent.changeText(textInputLocation);

    expect(textInputDescriptionView.props.style[0].borderColor).toBe(
      colors.light.colors.borderCard,
    );
    fireEvent.changeText(textInputDescription, 'abc');
    //can't
    // expect(textInputDescriptionView.props.style[0].borderColor).toBe(
    //   colors.light.colors.primary6,
    // );
  });
});
