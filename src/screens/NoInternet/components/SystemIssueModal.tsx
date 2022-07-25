import React from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import SystemIssueImg from '~/../assets/images/SystemIssue.svg';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import noInternetKeySelector from '../redux/keySelector';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';

const SystemIssueModal = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const systemIssue = useKeySelector(noInternetKeySelector.systemIssue);
  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(systemIssue ? 1 : 0, { duration: 500 }),
  }));

  if (!systemIssue) return null;

  return (
    <Animated.View style={[styles.root, optionsStyle]}>
      <TouchableOpacity style={styles.root} activeOpacity={1}>
        <View style={styles.modal}>
          <SvgIcon
            source={SystemIssueImg}
            width={200}
            height={200}
            tintColor="none"
          />
          <Text.H4 useI18n>internet_connection:system_issue:title</Text.H4>
          <Text.BodyM useI18n>internet_connection:system_issue:desc</Text.BodyM>
          <View style={styles.loadingContainer}>
            <LoadingIndicator color={theme.colors.purple30} size={24} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.transparent1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    modal: {
      width: 320,
      paddingTop: spacing.padding.large,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.gray40,
      borderRadius: 6,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      width: 40,
      height: 40,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      backgroundColor: colors.white,
      marginVertical: spacing.margin.extraLarge,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 6,
    },
  });
};

export default SystemIssueModal;
