import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Text from '~/baseComponents/Text';
import NewFeatureImg from '~/../assets/images/new_feeature_purple.svg';
import SvgIcon from '~/baseComponents/Icon/SvgIcon';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import useModalStore from '~/store/modal';

const AlertNewFeatureModal = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const { visible } = useModalStore((state) => state.alertNewFeature) || {};
  const modalActions = useModalStore((state) => state.actions);

  const onDismiss = () => {
    modalActions.hideAlertNewFeature();
  };
  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      visible ? 1 : 0, { duration: 500 },
    ),
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.root, optionsStyle]}>
      <TouchableOpacity
        style={styles.root}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text.H6>Upcoming Features</Text.H6>
          </View>
          <View style={styles.body}>
            <SvgIcon
              source={NewFeatureImg}
              width={250}
              height={200}
              tintColor="none"
            />
            <Text.H6 useI18n>
              new_feature:text_we_are_developing_this_feature
            </Text.H6>
            <Text.BodyM style={styles.notifyYou} useI18n>
              new_feature:text_we_will_notify_you
            </Text.BodyM>

            {/* Temporary button */}
            <Button.Secondary
              style={{
                marginTop: spacing.margin.large,
                paddingHorizontal: spacing.padding.large,
              }}
              onPress={onDismiss}
              useI18n
              color={theme.colors.purple10}
            >
              common:text_got_it
            </Button.Secondary>
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
    container: {
      width: 320,
      borderColor: colors.gray40,
      padding: spacing.padding.small,
      backgroundColor: colors.white,
      alignSelf: 'center',
      borderWidth: 1,
      borderRadius: 6,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    closeIcon: {
      marginRight: spacing.margin.small,
    },
    body: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.margin.large,
      paddingHorizontal: spacing.padding.small,
    },
    notifyYou: {
      textAlign: 'center',
    },
  });
};

export default AlertNewFeatureModal;
