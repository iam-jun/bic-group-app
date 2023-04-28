import React from 'react';
import lodash from 'lodash';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AddWork from './AddWork';
import * as navigationHook from '~/hooks/navigation';
import useMenuController from '../../store';
import i18n from '~/localization';
import { mockCurrentlyWork, mockWorkExperience } from '~/test/mock_data/workExperience';
import useUserProfileStore from '../../UserProfile/store';

describe('Menu screen', () => {
  it('should render correctly with mode add new work', () => {
    useMenuController.setState((state) => {
      state.selectedWorkItem = null as any;
      return state;
    });

    const rendered = renderWithRedux(<AddWork />);

    const headerTitle = rendered.queryByTestId('header.text');
    expect(headerTitle).toBeDefined();
    expect(headerTitle.children?.[0]).toEqual(i18n.t('settings:text_add_experience'));

    const headerButton = rendered.queryByTestId('add_work.save');
    expect(headerButton).toBeDefined();
    const headerButtonText = headerButton.findByProps({ testID: 'button.text' });
    expect(headerButtonText.props?.children).toEqual('common:text_add');

    const companyComp = rendered.getByTestId('add_work.company');
    expect(companyComp).toBeDefined();
    expect(companyComp.props?.placeholder).toEqual(i18n.t('settings:text_company'));
    expect(companyComp.props?.value).toEqual('');

    const positionComp = rendered.getByTestId('add_work.title_position');
    expect(positionComp).toBeDefined();
    expect(positionComp.props?.placeholder).toEqual(i18n.t('settings:text_enter_position'));
    expect(positionComp.props?.value).toEqual('');

    const locationComp = rendered.getByTestId('add_work.location');
    expect(locationComp).toBeDefined();

    const startDateComp = rendered.getByTestId('add_work.start_date');
    expect(startDateComp).toBeDefined();

    const endDateComp = rendered.getByTestId('add_work.end_date');
    expect(endDateComp).toBeDefined();

    const currentlyWorkHereComp = rendered.getByTestId('add_work.currently_work_here');
    expect(currentlyWorkHereComp).toBeDefined();

    const descriptionComp = rendered.getByTestId('add_work.description');
    expect(descriptionComp).toBeDefined();
    expect(descriptionComp.props?.placeholder).toEqual(i18n.t('settings:enter_description'));
    expect(descriptionComp.props?.value).toEqual('');
  });

  it('should render correctly with mode edit work', () => {
    useMenuController.setState((state) => {
      state.selectedWorkItem = mockWorkExperience;
      return state;
    });

    const rendered = renderWithRedux(<AddWork />);

    const headerTitle = rendered.queryByTestId('header.text');
    expect(headerTitle).toBeDefined();
    expect(headerTitle.children?.[0]).toEqual(i18n.t('settings:text_edit_experience'));

    const headerButton = rendered.queryByTestId('add_work.save');
    expect(headerButton).toBeDefined();
    const headerButtonText = headerButton.findByProps({ testID: 'button.text' });
    expect(headerButtonText.props?.children).toEqual('common:text_save');

    const companyComp = rendered.getByTestId('add_work.company');
    expect(companyComp).toBeDefined();
    expect(companyComp.props?.placeholder).toEqual(i18n.t('settings:text_company'));
    expect(companyComp.props?.value).toEqual(mockWorkExperience.company);

    const positionComp = rendered.getByTestId('add_work.title_position');
    expect(positionComp).toBeDefined();
    expect(positionComp.props?.placeholder).toEqual(i18n.t('settings:text_enter_position'));
    expect(positionComp.props?.value).toEqual(mockWorkExperience.titlePosition);

    const descriptionComp = rendered.getByTestId('add_work.description');
    expect(descriptionComp).toBeDefined();
    expect(descriptionComp.props?.placeholder).toEqual(i18n.t('settings:enter_description'));
    expect(descriptionComp.props?.value).toEqual(mockWorkExperience.description);
  });

  it('should go back successfully when press back', () => {
    const goBack = jest.fn();
    const rootNavigation = { goBack, canGoBack: true };

    useMenuController.setState((state) => {
      state.selectedWorkItem = null as any;
      return state;
    });
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<AddWork />);

    const buttonBack = rendered.queryByTestId('header.back.button');
    expect(buttonBack).toBeDefined();
    fireEvent.press(buttonBack);
    expect(goBack).toHaveBeenCalled();
  });

  it('should edit work successfully', () => {
    const spy = jest.spyOn(lodash, 'debounce');

    useMenuController.setState((state) => {
      state.selectedWorkItem = mockCurrentlyWork;
      return state;
    });

    const editWorkExperience = jest.fn();
    useUserProfileStore.setState((state) => {
      state.actions.editWorkExperience = editWorkExperience;
      return state;
    });

    const rendered = renderWithRedux(<AddWork />);

    const headerButton = rendered.queryByTestId('add_work.save');
    expect(headerButton).toBeDefined();
    const headerButtonText = headerButton.findByProps({ testID: 'button.text' });
    expect(headerButtonText.props?.children).toEqual('common:text_save');

    const companyComp = rendered.getByTestId('add_work.company');
    expect(companyComp).toBeDefined();
    fireEvent.changeText(companyComp, 'company name');
    jest.useFakeTimers();
    fireEvent.press(headerButton);

    expect(spy).toBeCalled();
    jest.runAllTimers();
    expect(editWorkExperience).toBeCalled();
  });

  it('should add work successfully', () => {
    const spy = jest.spyOn(lodash, 'debounce');

    useMenuController.setState((state) => {
      state.selectedWorkItem = null as any;
      return state;
    });

    const addWorkExperience = jest.fn();
    useUserProfileStore.setState((state) => {
      state.actions.addWorkExperience = addWorkExperience;
      return state;
    });

    const rendered = renderWithRedux(<AddWork />);

    const headerTitle = rendered.queryByTestId('header.text');
    expect(headerTitle).toBeDefined();
    expect(headerTitle.children?.[0]).toEqual(i18n.t('settings:text_add_experience'));

    const headerButton = rendered.queryByTestId('add_work.save');
    expect(headerButton).toBeDefined();
    const headerButtonText = headerButton.findByProps({ testID: 'button.text' });
    expect(headerButtonText.props?.children).toEqual('common:text_add');

    const companyComp = rendered.getByTestId('add_work.company');
    expect(companyComp).toBeDefined();
    fireEvent.changeText(companyComp, 'company name');

    const positionComp = rendered.getByTestId('add_work.title_position');
    expect(positionComp).toBeDefined();
    fireEvent.changeText(positionComp, 'position name');

    const locationComp = rendered.getByTestId('add_work.location');
    expect(locationComp).toBeDefined();
    fireEvent.press(locationComp);

    const startDateComp = rendered.getByTestId('add_work.start_date');
    expect(startDateComp).toBeDefined();
    fireEvent.press(startDateComp);

    const currentlyWorkHereComp = rendered.getByTestId('add_work.currently_work_here');
    expect(currentlyWorkHereComp).toBeDefined();
    fireEvent.press(currentlyWorkHereComp);

    const descriptionComp = rendered.getByTestId('add_work.description');
    expect(descriptionComp).toBeDefined();
    fireEvent.changeText(descriptionComp, 'description');

    fireEvent.press(headerButton);
    expect(spy).toBeCalled();
  });
});
