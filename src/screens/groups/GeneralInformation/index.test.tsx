import React from 'react';
import * as redux from 'react-redux';
import MockedNavigator from '~/test/MockedNavigator';
import { groupDetailData } from '~/test/mock_data/group';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import GeneralInformation from '.';
import * as helper from './helper';

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
    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const avatarComponent = rendered.getByTestId('general_information.avatar');
    const button = avatarComponent.findByProps({ testID: 'avatar.button_edit' });
    fireEvent.press(button);
    expect(_openImagePicker).toBeCalledWith(
      mockDispatchFn,
      groupDetailData.group.id,
      'icon',
      'group_avatar',
      'group',
    );
  });

  it('should call onEditCover when press edit cover', () => {
    const _openImagePicker = jest.spyOn(helper, '_openImagePicker');
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    const coverComponent = rendered.getByTestId('general_information.cover');
    const button = coverComponent.findByProps({ testID: 'cover.button_edit' });
    fireEvent.press(button);
    expect(_openImagePicker).toBeCalledWith(
      mockDispatchFn,
      groupDetailData.group.id,
      'backgroundImgUrl',
      'group_cover',
      'group',
    );
  });
});
