import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { Modalize } from 'react-native-modalize';
import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { sizes } from '~/theme/dimension';
import NotiSettingItem from '../components/NotiSettingItem';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import useAdvancedNotiSettingsStore from './store';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import Icon from '~/baseComponents/Icon';
import SearchInput from '~/baseComponents/Input/SearchInput';
import BottomSheet from '~/baseComponents/BottomSheet';
import SearchCoummunityContent from '../components/SearchCoummunityContent';
import AdvancedSettingItem from '../components/AdvancedSettingItem';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import SettingItemSkeleton from '../components/SettingItemSkeleton';

const AdvancedSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const modalizeRef = useRef<Modalize>(null);

  const { ids, actions } = useYourCommunitiesStore();
  const advancedSettingsActions = useAdvancedNotiSettingsStore((state) => state.actions);
  const isLoading = useAdvancedNotiSettingsStore((state) => state.isLoading);
  const isLoadingCommunitySettings = useAdvancedNotiSettingsStore((state) => state.isLoadingCommunitySettings);
  const isLoadingJoinedGroup = useAdvancedNotiSettingsStore((state) => state.isLoadingJoinedGroup);
  const slelectedCommunity = useAdvancedNotiSettingsStore((state) => state.slelectedCommunity);
  const joinedGroups = useAdvancedNotiSettingsStore((state) => state.joinedGroups);

  useEffect(
    () => {
      if (ids.length === 0) {
        advancedSettingsActions.setIsLoading(true);
        actions.getYourCommunities();
      }
    }, [],
  );

  const onRefresh = () => {
  };

  const onPressToggle = (isChecked: boolean) => {

  };

  const onChangeText = (text:string) => {

  };

  const onPressItem = (item: any) => {
    if (item?.id) {
      rootNavigation.navigate(notiStack.advancedSettingsDetail, { name: item?.id });
    }
  };

  const onOpenBottomSheet = () => {
    modalizeRef.current?.open?.();
  };

  const renderEmpty = () => (
    <View style={styles.container}>
      {Boolean(isLoadingJoinedGroup) ? <ActivityIndicator size="large" color={colors.neutral1} />
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
      <Text.H3 useI18n style={styles.emptyTitle}>
        notification:notification_settings:not_joined_the_community:title
      </Text.H3>
      <Text.SubtitleS useI18n>
        notification:notification_settings:not_joined_the_community:description
      </Text.SubtitleS>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text.BodyS useI18n color={colors.neutral40}>
            notification:notification_settings:description
          </Text.BodyS>
        </View>
        <View style={styles.communityContainer}>
          <Text.BadgeL useI18n color={colors.neutral80}>
            notification:notification_settings:advanced_notifications_settings:title_setup_community
          </Text.BadgeL>
          <ButtonWrapper onPress={onOpenBottomSheet}>
            <View style={[styles.dropdownContainer, styles.row]}>
              <Avatar.Tiny />
              <ViewSpacing width={spacing.margin.xSmall} />
              <Text.BodyS numberOfLines={1} style={styles.flex1}>
                {isEmpty(slelectedCommunity)
                  ? t('common:text_loading')
                  : slelectedCommunity?.name || ''}
              </Text.BodyS>
              <Icon icon="AngleDown" size={16} />
            </View>
          </ButtonWrapper>
        </View>
        {Boolean(isLoadingCommunitySettings)
          ? <SettingItemSkeleton />
          : (
            <NotiSettingItem
              item={{ name: 'hi', title: 'hi' }}
              iconName="Bell"
              onPressToggle={onPressToggle}
            />
          )}
      </View>
      <ViewSpacing height={spacing.margin.large} />
      <View style={styles.communityContainer}>
        <Text.BadgeL useI18n color={colors.neutral80}>
          notification:notification_settings:advanced_notifications_settings:title_setup_group
        </Text.BadgeL>
        <Text.BodyS useI18n color={colors.neutral40}>
          notification:notification_settings:advanced_notifications_settings:description_setup_group
        </Text.BodyS>
        <ViewSpacing height={spacing.margin.small} />
        <SearchInput
          style={styles.flex1}
          placeholder={t('home:newsfeed_search:search_people')}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }: any) => <AdvancedSettingItem item={item} onPress={onPressItem} />;

  const renderLoading = () => (
    <View style={styles.container}>
      <ActivityIndicator testID="your_communites.loading_more" />
    </View>
  );

  return (
    <ScreenWrapper
      testID="notification_settings"
      isFullView
      backgroundColor={colors.gray5}
    >
      <Header title={t('notification:notification_settings:title')} />
      <ViewSpacing height={spacing.padding.large} />
      {Boolean(isLoading)
        ? renderLoading()
        : (ids.length === 0 ? renderNothingToSetup()
          : (
            <FlatList
              data={joinedGroups}
              StickyHeaderComponent={renderHeader}
              keyExtractor={(item) => `group.${item?.id}`}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
            />
          )
        )}
      <BottomSheet
        modalizeRef={modalizeRef}
        ContentComponent={<SearchCoummunityContent />}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    background: {
      backgroundColor: colors.white,
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
      borderColor: colors.neutral5,
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
    emptyTitle: {
      textAlign: 'center',
      marginBottom: spacing.margin.xTiny,
      fontSize: sizes.mdH2,
    },
    communityContainer: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      backgroundColor: colors.white,
    },
    dropdownContainer: {
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      marginTop: spacing.margin.small,
      borderWidth: 1,
      borderColor: colors.neutral5,
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default AdvancedSettings;
