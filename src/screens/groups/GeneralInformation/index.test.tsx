import React from 'react';
import * as redux from 'react-redux';
import MockedNavigator from '~/test/MockedNavigator';
import { groupDetailData } from '~/test/mock_data/group';
import { myPermissionsData } from '~/test/mock_data/myPermissions';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import GeneralInformation from '.';
import * as helper from './helper';
import useMyPermissionsStore from '~/store/permissions';

describe('GeneralInformation component', () => {
  const component = () => (
    <GeneralInformation route={{ params: { id: groupDetailData.group.id, type: 'group' } }} />
  );
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
    useMyPermissionsStore.setState((state) => {
      state.data = myPermissionsData;
      return state;
    });

    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const avatarComponent = rendered.getByTestId('general_information.avatar');
    const button = avatarComponent.findByProps({ testID: 'info_card.button_edit' });
    fireEvent.press(button);

    expect(_openImagePicker).toBeCalledWith({
      dispatch: mockDispatchFn,
      id: groupDetailData.group.id,
      fieldName: 'icon',
      uploadType: 'group_avatar',
      destination: 'group',
      rootGroupId: groupDetailData.group.id,
    });
  });

  it('should call onEditCover when press edit cover', () => {
    useMyPermissionsStore.setState((state) => {
      state.data = myPermissionsData;
      return state;
    });

    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const coverComponent = rendered.getByTestId('general_information.cover');
    const button = coverComponent.findByProps({ testID: 'info_card.button_edit' });
    fireEvent.press(button);

    expect(_openImagePicker).toBeCalledWith({
      dispatch: mockDispatchFn,
      id: groupDetailData.group.id,
      fieldName: 'backgroundImgUrl',
      uploadType: 'group_cover',
      destination: 'group',
      rootGroupId: groupDetailData.group.id,
    });
  });
});
