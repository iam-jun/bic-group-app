import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {fireEvent} from '~/test/testUtils';

import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';

afterEach(cleanup);

describe('Avatar component', () => {
  const avatarLink = images.logo_bein;

  it(`renders correctly`, () => {
    const rendered = render(<Avatar.Large source={avatarLink} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly badge`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} badge={'iconReactionLove'} />,
    );
    const badgeComponent = getByTestId('avatar.badge');
    expect(badgeComponent).toBeDefined();
  });

  it(`renders correctly badge bottom`, () => {
    const {getByTestId} = render(
      <Avatar.Large
        source={avatarLink}
        badge={'iconReactionLove'}
        badgeBottom
      />,
    );
    const badgeComponent = getByTestId('avatar.badge');
    expect(badgeComponent).toBeDefined();
    expect(badgeComponent.props.style.top).toBe(undefined);
  });

  it(`renders correctly badge check`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} badgeCheck />,
    );
    const badgeComponent = getByTestId('avatar.badge_check');
    expect(badgeComponent).toBeDefined();
  });

  it(`renders correctly round`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} isRounded />,
    );
    const avatarComponent = getByTestId('avatar_container');
    expect(avatarComponent.props.style.borderRadius).not.toBe(undefined);
  });

  it(`renders correctly on press icon`, () => {
    const onPressIcon = jest.fn();
    const rendered = render(
      <Avatar.Large
        source={avatarLink}
        onPressAction={onPressIcon}
        actionIcon="iconClose"
      />,
    );
    const actionIconComponent = rendered.getByTestId('avatar.action_icon');
    expect(actionIconComponent).toBeDefined();
    expect(actionIconComponent.findByType('RNSVGSvgView')).toBeDefined();

    const btnIcon = rendered.getByTestId('avatar.action_icon.button');
    expect(btnIcon).toBeDefined();
    fireEvent.press(btnIcon);
    expect(onPressIcon).toBeCalled();
  });

  it(`renders correctly status`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} status="online" />,
    );
    const statusComponent = getByTestId('avatar.status');
    expect(statusComponent).toBeDefined();
  });
});
