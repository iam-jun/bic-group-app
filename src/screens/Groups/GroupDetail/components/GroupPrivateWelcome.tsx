import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import LockImg from '~/../assets/images/group_private.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import GroupAboutContent from '../../components/GroupAboutContent';
import GroupInfoHeader from './GroupInfoHeader';

const GroupPrivateWelcome = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content} testID="group_private_welcome">
        <View>
          <GroupInfoHeader />
        </View>
        <View style={styles.marginTop}>
          <GroupAboutContent />
        </View>
        <View
          style={styles.svgSection}
          testID="group_private_welcome.bottom_image">
          {/* @ts-ignore */}
          <SVGIcon source={LockImg} size={160} tintColor="none" />
          <Text.H6 useI18n>groups:private_group_welcome_message:title</Text.H6>
          <Text.Subtitle useI18n>
            groups:private_group_welcome_message:subtitle
          </Text.Subtitle>
        </View>
      </View>
    </ScrollView>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    content: {
      width: '100%',
      alignSelf: 'center',
    },
    marginTop: {
      marginTop: spacing.margin.large,
    },
    svgSection: {
      minHeight: 252,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default GroupPrivateWelcome;
