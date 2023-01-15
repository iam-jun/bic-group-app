import { StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  ZoomInEasyDown, ZoomOutEasyUp,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { compare } from 'compare-versions';

import useRemoteConfigStore from '~/store/remoteConfig';
import getEnv from '~/utils/env';
import { openUrl } from '~/utils/link';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const ForceUpdateView = () => {
  const minSupportedAppVersion = useRemoteConfigStore((state) => state.minSupportedVersion);
  const shouldForceUserUpdate = compare(getEnv('APP_VERSION'), minSupportedAppVersion, '<');
  const appStoreUrl = useRemoteConfigStore((state) => state.appStoreUrl);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const onPressUpdate = () => {
    openUrl(appStoreUrl);
  };

  if (!shouldForceUserUpdate) return null;

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      entering={ZoomInEasyDown}
      exiting={ZoomOutEasyUp}
    >
      <Icon style={styles.image} icon="iconUpdateNewVersion" size={250} />
      <ViewSpacing height={spacing.margin.base} />
      <View style={styles.textView}>
        <Text.H3 useI18n>
          notice:force_update:title
        </Text.H3>
        <ViewSpacing height={spacing.margin.base} />
        <Text.BodyS style={styles.descriptionText} useI18n>
          notice:force_update:description
        </Text.BodyS>
      </View>
      <ViewSpacing height={spacing.margin.big} />
      {!!appStoreUrl && (
        <Button.Primary style={styles.button} onPress={onPressUpdate} useI18n>
          notice:force_update:confirm
        </Button.Primary>
      )}
    </Animated.ScrollView>
  );
};

const createStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: colors.white,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: spacing.padding.large,
      zIndex: 99,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      marginRight: 20,
    },
    textView: {
      alignItems: 'center',
      paddingHorizontal: spacing.padding.big,
    },
    descriptionText: {
      textAlign: 'center',
    },
    button: {
      width: '50%',
      maxWidth: 200,
    },
  });
};

export default ForceUpdateView;
