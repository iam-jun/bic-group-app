import React, {useState} from 'react';
import {View, Image} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/beinComponents/Avatar';

const Section3 = () => {
  const {spacing, colors}: ITheme = useTheme();

  const renderSection = (title: string, child: React.ReactNode) => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          {title}
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        {child}
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderHeader = () => {
    return renderSection(
      'Header',
      <View>
        <Divider size={spacing?.margin.base} color={colors.borderCard} />
        <Header
          disableInsetTop
          title={'Notifications'}
          subTitle={'New Group Chat'}
          avatar={true}
          icon={'Search'}
          onPressIcon={() => alert('onPress search')}
          onPressMenu={() => alert('onPress menu')}
          buttonText={'Post'}
          onPressButton={() => alert('onPress post')}
        />
        <Divider size={spacing?.margin.base} color={colors.borderCard} />
        <Header
          disableInsetTop
          hideBack
          title={'Notifications'}
          avatar={true}
          icon={'Search'}
          onPressIcon={() => alert('onPress search')}
          onPressMenu={() => alert('onPress menu')}
        />
        <Divider />
        <Header
          disableInsetTop
          title={'Notifications'}
          buttonText={'Post'}
          onPressButton={() => alert('onPress post')}
        />
      </View>,
    );
  };

  const renderListItem = () => {
    return renderSection(
      'Primary Item',
      <View style={{paddingHorizontal: spacing?.padding.base}}>
        <PrimaryItem
          leftIcon={'Globe'}
          title={'Name'}
          subTitle={'Võ Thành Nhân'}
          onPressMenu={() => alert('onPress Menu')}
          onPressEdit={() => alert('onPress Edit')}
          onPressCheckbox={action => alert('action Checkbox: ' + action)}
          onPressToggle={action => alert('action Toggle: ' + action)}
          RightComponent={
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
          }
        />
        <Divider />
        <PrimaryItem
          title={'Nhận thông báo'}
          onPressToggle={action => alert('onPress Toggle: ' + action)}
        />
        <Divider />
      </View>,
    );
  };

  const renderAvatar = () => {
    return renderSection(
      'Avatar',
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: spacing?.padding.base,
        }}>
        <Avatar.Tiny
          style={{margin: spacing?.margin.small}}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          // onPressAction={() => alert('onPress action')}
          // status={'online'}
          // badge={'iconReactionLove'}
        />
        <Avatar.Small
          style={{margin: spacing?.margin.small}}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          // onPressAction={() => alert('onPress action')}
          status={'online'}
          // badge={'iconReactionLove'}
        />
        <Avatar.Medium
          style={{margin: spacing?.margin.small}}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          onPressAction={() => alert('onPress action')}
          // status={'online'}
          // badge={'iconReactionLove'}
        />
        <Avatar.Large
          style={{margin: spacing?.margin.small}}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          // onPressAction={() => alert('onPress action')}
          // status={'online'}
          badge={'iconReactionLove'}
          badgeBottom
        />
        <Avatar.UltraLarge
          style={{margin: spacing?.margin.small}}
          source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          // onPressAction={() => alert('onPress action')}
          // status={'online'}
          badge={'University'}
        />
        <Avatar
          style={{margin: spacing?.margin.small}}
          // source={'https://i.ibb.co/DW2bMGR/pikachu.jpg'}
          // onPressAction={() => alert('onPress action')}
          // // status={'online'}
          // badge={'iconReactionLove'}
          // badgeBottom
        />
      </View>,
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 3</Text.H5>
      {renderHeader()}
      {renderListItem()}
      {renderAvatar()}
    </View>
  );
};

export default Section3;
