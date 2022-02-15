import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';

afterEach(cleanup);

const theme: ITheme = useTheme() as ITheme;
const {spacing, dimension, colors} = theme;

describe('Avatar component', () => {
  const avatarLink =
    '	https://bein-entity-attribute-sandbox.s3.ap-southe…riginal/f3f4639e-6b1c-478f-ba6b-be1559197199.jpeg';
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
    const badgeComponent = getByTestId('avatar.badgeCheck');
    expect(badgeComponent).toBeDefined();
  });

  it(`renders correctly round`, () => {
    const {getByTestId} = render(
      <Avatar.Large source={avatarLink} isRounded />,
    );
    const avatarComponent = getByTestId('avatarContainer');
    expect(avatarComponent.props.style.borderRadius).not.toBe(undefined);
  });

  //   it(`renders correctly placeholder Image`, () => {
  //     const {getByTestId} = render(
  //       <Avatar.Large
  //         source={avatarLink}
  //         placeholderSource={images.img_user_avatar_default}
  //       />,
  //     );
  //     const imageComponent = getByTestId('Image__placeholder');
  //     expect(imageComponent.props.style[0].borderWidth).not.toBe(undefined);
  //   });
  //placeholderSource
  /**<Avatar.Large
            style={styles.marginRight}
            source={item.avatar}
            placeholderSource={images.img_user_avatar_default}
          />
          
           <Avatar.Large
          source={item.avatar}
          actionIcon="iconClose"
          placeholderSource={images.img_user_avatar_default}
          onPressAction={() => onSelectUser(item)}
        />
        
         <Avatar.Group
                source={avatar}
                style={styles.avatar}
                variant="small"
                {...avatarProps}
              />*/
});
