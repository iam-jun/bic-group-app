import React from 'react';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import initialState from '~/store/initialState';
import { configureStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import GroupInfoView from './InfoView';

describe('GroupInfoView component', () => {
  const baseProps = {
    id: '1',
    onPressPrivacy: jest.fn(),
    name: 'Name',
    description: 'Description',
    privacy: 'PRIVACY',
    canEditPrivacy: false,
    canEditInfo: false,
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
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoView {...baseProps} canEditInfo type="group" />, store);
    const component = rendered.getByTestId('info_view.description');

    fireEvent.press(component);

    expect(navigate).toBeCalledWith(groupStack.editDescription, {
      id: baseProps.id,
      description: baseProps.description,
      type: 'group',
    });
  });

  it('should call onPressPrivacy when privacy button press', () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const onPressPrivacy = jest.fn();

    const props = {
      ...baseProps,
      onPressPrivacy,
      canEditPrivacy: true,
    };

    const rendered = renderWithRedux(<GroupInfoView {...props} type="community" />, store)
    const component = rendered.getByTestId('info_view.privacy');

    fireEvent.press(component);

    expect(onPressPrivacy).toBeCalled();
  });
});
