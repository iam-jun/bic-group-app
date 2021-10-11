import React from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import GroupAboutContent from '../../components/GroupAboutContent';
import GroupInfoHeader from './GroupInfoHeader';
import LockImg from '~/../assets/images/group_private.svg';
import {deviceDimensions} from '~/theme/dimension';

const GroupPrivateWelcome = ({parentWidth}: {parentWidth?: number}) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, parentWidth);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <GroupInfoHeader />
        <Divider
          size={16}
          color={
            Platform.OS === 'web'
              ? theme.colors.surface
              : theme.colors.bgSecondary
          }
        />
        <GroupAboutContent />
        <View style={styles.svgSection}>
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

const themeStyles = (theme: ITheme, parentWidth = deviceDimensions.phone) => {
  const {dimension, spacing} = theme;
  const bigParentOnWeb =
    Platform.OS === 'web' && parentWidth > dimension.maxNewsfeedWidth;

  return StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: Platform.OS === 'web' ? dimension.maxNewsfeedWidth : undefined,
      alignSelf: 'center',
      paddingTop: bigParentOnWeb ? spacing.margin.small : 0,
    },
    svgSection: {
      minHeight: 252,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default GroupPrivateWelcome;
