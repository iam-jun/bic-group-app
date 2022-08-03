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
    const rendered = render(
      <Avatar.Large source={avatarLink} badge={'iconReactionLove'} />,
    );
    const {getByTestId} = rendered;
    const badgeComponent = getByTestId('avatar.badge');
    expect(badgeComponent).toBeDefined();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly badge bottom`, () => {
    const rendered = render(
      <Avatar.Large
        source={avatarLink}
        badge={'iconReactionLove'}
        badgeBottom
      />,
    );
    const {getByTestId} = rendered;
    const badgeComponent = getByTestId('avatar.badge');
    expect(badgeComponent).toBeDefined();
    expect(badgeComponent.props.style.top).toBe(undefined);
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly badge check`, () => {
    const rendered = render(<Avatar.Large source={avatarLink} badgeCheck />);
    const {getByTestId} = rendered;
    const badgeComponent = getByTestId('avatar.badge_check');
    expect(badgeComponent).toBeDefined();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly round`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} isRounded />,
    );
    const avatarComponent = getByTestId('avatar_container');
    expect(avatarComponent.props.style.borderRadius).not.toBe(undefined);
  });

  it(`should call props onPressAction`, () => {
    const onPressIcon = jest.fn();
    const rendered = render(
      <Avatar.Large
        source={avatarLink}
        onPressAction={onPressIcon}
        actionIcon="iconClose"
      />,
    );

    const btnIcon = rendered.getByTestId('avatar.action_icon.button');
    expect(btnIcon).toBeDefined();
    fireEvent.press(btnIcon);
    expect(onPressIcon).toBeCalled();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly status`, () => {
    const rendered = render(
      <Avatar.Large source={avatarLink} status="online" />,
    );
    const {getByTestId} = rendered;
    const statusComponent = getByTestId('avatar.status');
    expect(statusComponent).toBeDefined();
    expect(rendered).toMatchSnapshot();
  });
});
