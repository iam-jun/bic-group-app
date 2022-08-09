import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/bicComponents/Avatar';
import spacing from '~/theme/spacing';

const Section3 = () => {
  const { colors }: ExtendedTheme = useTheme();

  const renderSection = (title: string, child: React.ReactNode) => (
    <>
      <Text.H3 style={{ marginHorizontal: spacing?.margin.base }}>
        {title}
      </Text.H3>
      <Divider style={{ margin: spacing?.margin.base }} />
      {child}
      <Divider
        style={{
          margin: spacing?.margin.base,
          marginBottom: spacing?.margin.big,
        }}
      />
    </>
  );

  const renderHeader = () => renderSection(
    'Header',
    <View>
      <Divider size={spacing?.margin.base} color={colors.gray40} />
      <Header
        disableInsetTop
        title="Notifications"
        subTitle="New Group Chat"
        avatar="https://i.ibb.co/DW2bMGR/pikachu.jpg"
        icon="search"
        onPressIcon={() => alert('onPress search')}
        onPressMenu={() => alert('onPress menu')}
        buttonText="Post"
        onPressButton={() => alert('onPress post')}
      />
      <Divider size={spacing?.margin.base} color={colors.gray40} />
      <Header
        disableInsetTop
        hideBack
        title="Notifications"
        avatar="https://i.ibb.co/DW2bMGR/pikachu.jpg"
        icon="search"
        onPressIcon={() => alert('onPress search')}
        onPressMenu={() => alert('onPress menu')}
      />
      <Divider />
      <Header
        disableInsetTop
        title="Notifications"
        buttonText="Post"
        onPressButton={() => alert('onPress post')}
      />
    </View>,
  );

  const renderListItem = () => renderSection(
    'Primary Item',
    <View style={{ paddingHorizontal: spacing?.padding.base }}>
      <PrimaryItem
        leftIcon="Globe"
        title="Name"
        subTitle="Võ Thành Nhân"
        onPressMenu={() => alert('onPress Menu')}
        onPressEdit={() => alert('onPress Edit')}
        onPressCheckbox={(action) => alert(`action Checkbox: ${action}`)}
        onPressToggle={(action) => alert(`action Toggle: ${action}`)}
        RightComponent={(
          <Image
            style={{
              width: 32,
              height: 32,
              marginLeft: spacing?.margin.extraLarge,
            }}
            source={{
              uri: 'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg',
            }}
          />
          )}
      />
      <Divider />
      <PrimaryItem
        title="Nhận thông báo"
        onPressToggle={(action) => alert(`onPress Toggle: ${action}`)}
      />
      <Divider />
    </View>,
  );

  const renderAvatar = () => renderSection(
    'Avatar',
    <View style={{ marginHorizontal: spacing?.margin.base }}>
      <Text.H5>{'<Avatar.Tiny/>'}</Text.H5>
      <Text.H5>{'<Avatar.XSmall/>'}</Text.H5>
      <Text.H5>{'<Avatar.Small/>'}</Text.H5>
      <Text.H5>{'<Avatar.Base/>'}</Text.H5>
      <Text.H5>{'<Avatar.Medium/>'}</Text.H5>
      <Text.H5>{'<Avatar.Large/>'}</Text.H5>
      <Text.H5>{'<Avatar.XLarge/>'}</Text.H5>
      <View style={{ flexDirection: 'row' }}>
        <Avatar.Tiny
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
        />
        <Avatar.XSmall
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
          // onPressAction={() => alert('onPress action')}
          status="online"
        />
        <Avatar.Small
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
          // onPressAction={() => alert('onPress action')}
          status="online"
        />
        <Avatar.Base
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
          onPressAction={() => alert('onPress action')}
        />
        <Avatar.Medium
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
          onPressAction={() => alert('onPress action')}
        />
        <Avatar.Large
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
            // onPressAction={() => alert('onPress action')}
            // status={'online'}
          badge="iconReactionLove"
          badgeBottom
        />
        <Avatar.XLarge
          style={{ margin: spacing?.margin.small }}
          source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
            // onPressAction={() => alert('onPress action')}
            // status={'online'}
          badge="University"
        />
        <Avatar
          style={{ margin: spacing?.margin.small }}
        />
      </View>
      <Divider style={{ marginBottom: spacing?.margin.base }} />
      <Text.H5>{'<Avatar.Group source={\'\'} />'}</Text.H5>
      <Avatar.Group
        source="https://i.ibb.co/DW2bMGR/pikachu.jpg"
        totalMember={123}
      />
      <Divider style={{ marginVertical: spacing?.margin.base }} />
      <Text.H5>{'<Avatar.Group source={[]} />'}</Text.H5>
      <View style={{ flexDirection: 'row' }}>
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
          ]}
          totalMember={123}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Avatar.Group
          variant="small"
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
          ]}
        />
        <Avatar.Group
          variant="medium"
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          variant="large"
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
          ]}
          totalMember={123}
        />
        <Avatar.Group
          style={{ margin: spacing?.margin.small }}
          source={[
            'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
            'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
          ]}
          totalMember={123}
        />
      </View>
      <Avatar.Group style={{ margin: spacing?.margin.small }} />
    </View>,
  );

  return (
    <View style={{}}>
      <Text.H5 style={{ margin: spacing?.margin.base }}>Section 3</Text.H5>
      {renderHeader()}
      {renderListItem()}
      {renderAvatar()}
    </View>
  );
};

export default Section3;
