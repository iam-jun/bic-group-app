import React from 'react';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import initialState from '~/store/initialState';
import {configureStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import GroupInfoView from './GroupInfoView';

describe('GroupInfoView component', () => {
  const baseProps = {
    id: '1',
    onPressPrivacy: jest.fn(),
  };

  const mockStore = configureStore([]);

  const storeData = {...initialState};

  const navigate = jest.fn();
  const goBack = jest.fn();
  const rootNavigation = {navigate, goBack};
  jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
    return {rootNavigation} as any;
  });

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <GroupInfoView {...baseProps} />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show correct name`, () => {
    storeData.groups.groupDetail.group.name = 'test';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} />, store);
    const component = rendered.getByTestId('group_info_view.name');
    const itemComponent = component.findByType(PrimaryItem);

    expect(itemComponent.props.subTitle).toBe('test');
  });

  it(`should show correct description`, () => {
    storeData.groups.groupDetail.group.description = 'test';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} />, store);
    const component = rendered.getByTestId('group_info_view.description');
    const itemComponent = component.findByType(PrimaryItem);

    expect(itemComponent.props.subTitle).toBe('test');
  });

  it(`should call navigate to editGroupDescripton when edit button press`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} />, store);
    const component = rendered.getByTestId('group_info_view.description');

    fireEvent.press(component);

    expect(navigate).toBeCalledWith(groupStack.editGroupDescription, {
      groupId: '1',
    });
  });

  it(`should call onPressPrivacy when privacy button press`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const onPressPrivacy = jest.fn();

    const props = {
      ...baseProps,
      onPressPrivacy,
    };

    const rendered = renderWithRedux(<GroupInfoView {...props} />, store);
    const component = rendered.getByTestId('group_info_view.privacy');

    fireEvent.press(component);

    expect(onPressPrivacy).toBeCalled();
  });
});
