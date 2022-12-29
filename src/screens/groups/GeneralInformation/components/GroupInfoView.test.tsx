import React from 'react';
import { act } from 'react-test-renderer';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import initialState from '~/storeRedux/initialState';
import { configureStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import useGeneralInformationStore from '../store';
import GroupInfoView from './InfoView';

describe('GroupInfoView component', () => {
  const baseProps = {
    id: '1',
    onPressPrivacy: jest.fn(),
    name: 'Name',
    description: 'Description',
    privacy: GroupPrivacyType.PRIVATE,
    canEditPrivacy: false,
    canEditInfo: false,
    isJoinApproval: true,
    rootGroupId: '12',
  };

  const mockStore = configureStore([]);

  const storeData = { ...initialState };

  const navigate = jest.fn();
  const goBack = jest.fn();
  const rootNavigation = { navigate, goBack };
  jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <GroupInfoView {...baseProps} type="community" />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show correct name', () => {
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} type="community" />, store);
    const component = rendered.getByTestId('info_view.name.sub_title');
    expect(component).toBeDefined();
    expect(component.children[0]).toBe(baseProps.name);
  });

  it('should show correct description', () => {
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} type="community" />, store);
    const component = rendered.getByTestId('info_view.description.sub_title');
    expect(component.children[0]).toBe(baseProps.description);
  });

  it('should call navigate to editGroupDescripton when edit button press', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} canEditInfo type="group" />);
    const component = rendered.getByTestId('info_view.description');

    fireEvent.press(component);

    expect(navigate).toBeCalledWith(groupStack.editDescription, {
      id: baseProps.id,
      description: baseProps.description,
      type: 'group',
    });
  });

  it('should call onPressPrivacy when privacy button press', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const onPressPrivacy = jest.fn();

    const props = {
      ...baseProps,
      onPressPrivacy,
      canEditPrivacy: true,
    };

    const rendered = renderWithRedux(<GroupInfoView {...props} type="community" />);
    const component = rendered.getByTestId('info_view.privacy');

    fireEvent.press(component);

    expect(onPressPrivacy).toBeCalled();
  });
});
