import i18next from 'i18next';
import React from 'react';
import * as redux from 'react-redux';
import privacyTypes from '~/constants/privacyTypes';
import groupsActions from '~/screens/Groups/redux/actions';
import initialState from '~/store/initialState';
import MockedNavigator from '~/test/MockedNavigator';
import {groupDetailData} from '~/test/mock_data/group';
import {configureStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import GeneralInformation from '.';
import * as helper from './helper';

describe('GeneralInformation component', () => {
  const component = () => (
    <GeneralInformation route={{params: {groupId: groupDetailData.group.id}}} />
  );
  const mockStore = configureStore([]);
  const storeData = {...initialState};
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  beforeEach(() => {
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  it('renders correctly', () => {
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const screenComponent = rendered.queryByTestId('general_information');

    expect(screenComponent).not.toBeNull();
  });

  it('should call onEditAvatar when press edit avatar', () => {
    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const avatarComponent = rendered.getByTestId('general_information.avatar');
    const button = avatarComponent.findByProps({testID: 'avatar.button_edit'});
    fireEvent.press(button);
    expect(_openImagePicker).toBeCalledWith(
      mockDispatchFn,
      groupDetailData.group.id,
      'icon',
      'group_avatar',
    );
  });

  it('should call onEditCover when press edit cover', () => {
    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const coverComponent = rendered.getByTestId('general_information.cover');
    const button = coverComponent.findByProps({testID: 'cover.button_edit'});
    fireEvent.press(button);
    expect(_openImagePicker).toBeCalledWith(
      mockDispatchFn,
      groupDetailData.group.id,
      'background_img_url',
      'group_cover',
    );
  });

  it(`should call change privacy when group's privacy is public`, () => {
    storeData.groups.groupDetail.group.privacy = 'PUBLIC';
    storeData.groups.groupDetail.total_pending_members = 0;
    const store = mockStore(storeData);

    const spy = jest.spyOn(groupsActions, 'editGroupDetail');
    const rendered = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const itemComponent = rendered.getByTestId(
      `general_information.privacy_item.${privacyTypes[1].type}`,
    );
    fireEvent.press(itemComponent);
    expect(spy).toBeCalledWith({
      data: {id: groupDetailData.group.id, privacy: privacyTypes[1].type},
      editFieldName: i18next.t('common:text_privacy'),
    });
  });

  it(`should call alert when change privacy to public`, () => {
    storeData.groups.groupDetail.group.privacy = 'PRIVATE';
    storeData.groups.groupDetail.total_pending_members = 3;
    const store = mockStore(storeData);

    const spy = jest.spyOn(helper, 'alertAction');

    const rendered = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );

    const itemComponent = rendered.getByTestId(
      `general_information.privacy_item.${privacyTypes[0].type}`,
    );
    fireEvent.press(itemComponent);
    expect(spy).toBeCalled();
  });

  it(`should call alert when change privacy to secret`, () => {
    storeData.groups.groupDetail.group.privacy = 'PRIVATE';
    storeData.groups.groupDetail.total_pending_members = 3;
    const store = mockStore(storeData);

    const spy = jest.spyOn(helper, 'alertAction');

    const rendered = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );

    const itemComponent = rendered.getByTestId(
      `general_information.privacy_item.${privacyTypes[2].type}`,
    );
    fireEvent.press(itemComponent);
    expect(spy).toBeCalled();
  });
});
