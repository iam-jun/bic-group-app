import React from 'react';
import {
  ActivityIndicator, RefreshControl, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import { Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const AdvancedSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const loading = false;

  const onRefresh = () => {
  };

  const onPressToggle = (isChecked: boolean) => {

  };

  const renderEmpty = () => (
    <View style={styles.container}>
      {Boolean(loading) ? <ActivityIndicator size="large" color={colors.neutral1} />
        : (
          <EmptyScreen
            source={images.img_empty_search_post}
            size={100}
            title="notification:notification_settings:error_title"
            description="notification:notification_settings:error_description"
            ButtonComponent={(
              <Button.Primary
                size="medium"
                onPress={onRefresh}
                useI18n
              >
                common:text_refresh
              </Button.Primary>
        )}
          />
        )}
    </View>
  );

  const renderNothingToSetup = () => (
    <View
      style={[styles.container, styles.boxNothingToSetup]}
      testID="advanced_notifications_settings.nothing_setup"
    >
      <Image
        resizeMode="contain"
        source={images.img_empty_box}
        style={styles.imgEmpty}
      />
      <Text.BodyS color={colors.neutral40} useI18n>
        your_content:text_empty
      </Text.BodyS>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text.BodyS>
        {t('notification:notification_settings:description')}
      </Text.BodyS>
    </View>
  );

  return (
    <ScreenWrapper
      testID="notification_settings"
      isFullView
      backgroundColor={colors.gray5}
    >
      <Header title={t('notification:notification_settings:title')} />
      <Animated.ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.flex1}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
          />
        )}
      >
        <ViewSpacing height={spacing.padding.large} />
        {/* {renderEmpty()} */}
        {renderNothingToSetup()}
      </Animated.ScrollView>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    headerContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
    boxNothingToSetup: {
      paddingVertical: spacing.padding.big,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
    },
    imgEmpty: {
      width: 100,
      aspectRatio: 1,
      marginBottom: spacing.margin.large,
    },
  });
};

export default AdvancedSettings;
