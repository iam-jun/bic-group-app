import React from 'react';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import HeaderMenu from './HeaderMenu';

describe('HeaderMenu component', () => {
  const onPressAdminTools = jest.fn();

  it('should render AdminTools correctly when user is an admin', () => {
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting
        isMember
        onPressAdminTools={onPressAdminTools}
      />,
    );
    const adminTool = wrapper.getByTestId('header_menu.admin_tools');
    expect(adminTool).toBeDefined();
    fireEvent.press(adminTool);
    expect(onPressAdminTools).toBeCalled();
  });

  it('should NOT render AdminTools when user is not an admin', () => {
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressAdminTools={onPressAdminTools}
      />,
    );
    const adminTool = wrapper.queryByTestId('header_menu.admin_tools');
    expect(adminTool).toBeNull();
  });

  it('should render Copy link correctly', () => {
    const onPressCopyLink = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressCopyLink={onPressCopyLink}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.copy_link');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressCopyLink).toBeCalled();
  });

  it('should render Share correctly', () => {
    const onPressShare = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressShare={onPressShare}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.share_community');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressShare).toBeCalled();
  });

  it('should render Following correctly', () => {
    const onPressFollowing = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressFollowing={onPressFollowing}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.following');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressFollowing).toBeCalled();
  });

  it('should render Pin correctly', () => {
    const onPressPin = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressPin={onPressPin}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.pin_community');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressPin).toBeCalled();
  });

  it('should render Notifications correctly', () => {
    const onPressNotification = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressNotification={onPressNotification}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.notifications');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressNotification).toBeCalled();
  });

  it('should render Leave correctly when user is a member', () => {
    const onPressLeave = jest.fn();
    const wrapper = renderWithRedux(
      <HeaderMenu
        type="community"
        canSetting={false}
        isMember
        onPressLeave={onPressLeave}
      />,
    );
    const itemComponent = wrapper.getByTestId('header_menu.leave_community');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(onPressLeave).toBeCalled();
  });

  it('should NOT render Leave correctly when user is NOT a member', () => {
    const wrapper = renderWithRedux(
      <HeaderMenu type="community" canSetting={false} isMember={false} />,
    );
    const itemComponent = wrapper.queryByTestId('header_menu.leave_community');
    expect(itemComponent).toBeNull();
  });
});
