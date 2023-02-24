import React from 'react';
import * as reactNativePermission from 'react-native-permissions';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CoverHeader from './index';

describe('CoverHeader component', () => {
  const baseProps = {
    id: 'test',
    isCurrentUser: true,
    bgImg: 'test',
    avatar: 'test',
    uploadCallback: jest.fn(),
  };

  it('renders correctly with onLayout', () => {
    const spyCheckPermission = jest.spyOn(reactNativePermission, 'check');
    const rendered = renderWithRedux(<CoverHeader {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.cover_header');
    expect(containerComponent).toBeDefined();

    fireEvent(containerComponent, 'onLayout', {
      nativeEvent: { layout: { width: 100 } },
    });

    const editCover = getByTestId('user_profile.cover_image.edit_button');
    fireEvent.press(editCover);
    expect(spyCheckPermission).toBeCalled();

    const editAvatar = getByTestId('user_profile.avatar_image.edit_button');
    fireEvent.press(editAvatar);
    expect(spyCheckPermission).toBeCalled();
  });

  it('renders correctly Not onLayout', () => {
    const rendered = renderWithRedux(<CoverHeader {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.cover_header');
    expect(containerComponent).toBeDefined();

    fireEvent(containerComponent, 'onLayout', {
      nativeEvent: { layout: { width: 0 } },
    });
  });
});
