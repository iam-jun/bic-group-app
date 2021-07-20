import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';

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

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 3</Text.H5>
      {renderHeader()}
    </View>
  );
};

export default Section3;
