import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';

import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';

afterEach(cleanup);

describe('Avatar Group component', () => {
  const avatarLink = images.logo_bein;
  const listAvatar2 = [
    'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
  ];
  const listAvatar3 = [
    'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
  ];
  const listAvatar4 = [
    'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
  ];

  const listAvatar5 = [
    'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
    'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
  ];

  it(`renders correctly`, () => {
    const rendered = render(<Avatar.Group />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly group with no member`, () => {
    const {getByTestId} = render(<Avatar.Group />);
    const avatarComponent = getByTestId('avatar_container');
    expect(avatarComponent).toBeDefined();
  });

  it(`renders correctly avatar when call Avatar.Group`, () => {
    const {getByTestId} = render(<Avatar.Group source={avatarLink} />);
    const avatarComponent = getByTestId('avatar.image');
    expect(avatarComponent).toBeDefined();
  });

  it(`renders correctly group with 1 member`, () => {
    const {getByTestId} = render(<Avatar.Group source={[avatarLink]} />);
    const avatarComponent = getByTestId('avatar_group.item_0');
    expect(avatarComponent).toBeDefined();
  });

  it(`renders correctly group with 2 member`, () => {
    const {getByTestId} = render(<Avatar.Group source={listAvatar2} />);
    const groupComponent = getByTestId('avatar_group.group_2');
    expect(groupComponent).toBeDefined();
  });

  it(`renders correctly group with 3 member`, () => {
    const {getByTestId} = render(<Avatar.Group source={listAvatar3} />);
    const groupComponent = getByTestId('avatar_group.group_3');
    expect(groupComponent).toBeDefined();
  });

  it(`renders correctly group with 4 member`, () => {
    const {getByTestId} = render(<Avatar.Group source={listAvatar4} />);
    const groupComponent = getByTestId('avatar_group.group_4');
    expect(groupComponent).toBeDefined();
  });

  it(`renders correctly group with 4+ member with totalMember`, () => {
    const {getByTestId} = render(
      <Avatar.Group source={listAvatar5} totalMember={100} />,
    );
    const groupComponent = getByTestId('avatar_group.group_4_plus');
    expect(groupComponent).toBeDefined();
    const totalMemberComponent = getByTestId('avatar_group.total_member');
    expect(totalMemberComponent).toBeDefined();
  });

  it(`renders correctly group with 4+ member without totalMember`, () => {
    const {getByTestId} = render(<Avatar.Group source={listAvatar5} />);
    const groupComponent = getByTestId('avatar_group.group_4_plus');
    expect(groupComponent).toBeDefined();
    const fourthItemComponent = getByTestId('avatar_group.item_3');
    expect(fourthItemComponent).toBeDefined();
  });
});
