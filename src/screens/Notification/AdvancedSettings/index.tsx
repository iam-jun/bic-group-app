import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import { useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import EmptyScreen from '~/components/EmptyScreen';
import images from '~/resources/images';
import { Button, ScreenWrapper } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { sizes } from '~/theme/dimension';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import useAdvancedNotiSettingsStore from './store';
import AdvancedSettingItem from '../components/AdvancedSettingItem';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import AdvancedSettingHeader from '../components/AdvancedSettingHeader';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import SearchCommunityView from './components/SearchCommunityView';
import SearchGroupView from './components/SearchGroupView';
import { IGroupNotificationSetting } from '~/interfaces/INotification';

const _AdvancedSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);
  const [isOpenSearchGroups, setIsOpenSearchGroups] = useState(false);

  const {
    ids, actions, items, reset: resetCommunityStore,
  } = useYourCommunitiesStore();
  const advancedSettingsActions = useAdvancedNotiSettingsStore((state) => state.actions);
  const isLoading = useAdvancedNotiSettingsStore((state) => state.isLoading);
  const isLoadingJoinedGroup = useAdvancedNotiSettingsStore((state) => state.isLoadingJoinedGroup);
  const joinedGroups = useAdvancedNotiSettingsStore((state) => state.joinedGroups);
  const selectedCommunity = useAdvancedNotiSettingsStore((state) => state.selectedCommunity);
  const comId = selectedCommunity?.communityId || selectedCommunity?.id;

  const communitySettingData: any = useAdvancedNotiSettingsStore((state) => state.communityData?.[comId] || {});
  const hasNextPage = useAdvancedNotiSettingsStore((state) => state.hasNextPage);
  const { actions: joinedActions } = useSearchJoinedCommunitiesStore();
  const { reset: resetAdvancedSettings } = useAdvancedNotiSettingsStore();

  useEffect(
    () => {
      if (ids.length === 0) {
        getData();
      } else {
        advancedSettingsActions.setSelectedCommunity(items?.[ids[0]]);
      }
      return () => {
        resetAdvancedSettings();
        resetCommunityStore();
      };
    }, [],
  );

  const getData = () => {
    advancedSettingsActions.setIsLoading(true);
    actions.getYourCommunities({ isRefreshing: true, isFromNotificationScreen: true });
  };

  const onRefresh = () => {
    getData();
  };

  const onLoadMore = () => {
    if (!hasNextPage || isLoadingJoinedGroup) return;
    advancedSettingsActions.getJoinedGroup(comId);
  };

  const onChangeToggle = (isChecked: boolean) => {
    const payload = { enable: isChecked };
    const dataUpdateStore: any = {
      ...selectedCommunity,
      enable: isChecked,
      id: comId,
    };
    advancedSettingsActions.updateCommunitySettings(payload, dataUpdateStore);
  };

  const onPressCommuntiyItem = (item: any) => {
    setIsOpenSearchCommunity(false);
    advancedSettingsActions.setSelectedCommunity(item);
  };

  const onPressItem = (item: IGroupNotificationSetting) => {
    if (item?.id) {
      rootNavigation.navigate(notiStack.advancedSettingsDetail, {
        name: item.name,
        groupId: item.id,
        communityId: comId,
      });
    }
    setIsOpenSearchCommunity(false);
  };

  const onOpenSearchCommunity = () => {
    joinedActions.searchJoinedCommunities({ key: '' }, true);
    setIsOpenSearchCommunity(true);
  };

  const onCloseSearchCommunity = () => {
    setIsOpenSearchCommunity(false);
  };

  const onCloseSearchGrops = () => {
    setIsOpenSearchGroups(false);
  };

  const onOpenGroupSearch = () => {
    setIsOpenSearchGroups(true);
  };

  const renderEmpty = () => {
    if (isLoadingJoinedGroup) return null;
    return (
      <View style={styles.container}>
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
      </View>
    );
  };

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

  const renderHeader = useCallback(() => (
    <AdvancedSettingHeader
      onPressSearch={onOpenGroupSearch}
      onChangeToggle={onChangeToggle}
      onPressToShowBottomSheet={onOpenSearchCommunity}
    />
  ), [communitySettingData]);

  const renderItem = useCallback(({ item }: any) => (
    <AdvancedSettingItem
      item={item}
      onPress={onPressItem}
    />
  ), [selectedCommunity?.id, communitySettingData?.enable]);

  const renderLoading = () => (
    <View style={styles.container}>
      <ActivityIndicator testID="advanced_setting.loading" />
    </View>
  );

  const renderListFooter = () => {
    if (!hasNextPage || !isLoadingJoinedGroup) return null;
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator testID="advanced_settings.loading_more" />
      </View>
    );
  };

  const keyExtractor = (item: any) => `group.${item}.${selectedCommunity?.id}`;

  const renderContent = () => {
    if (ids.length === 0) return renderNothingToSetup();
    return (
      <FlatList
        data={joinedGroups}
        extraData={communitySettingData}
        scrollEventThrottle={16}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderListFooter}
        onEndReachedThreshold={0.1}
        onEndReached={onLoadMore}
        removeClippedSubviews
      />
    );
  };

  return (
    <ScreenWrapper
      testID="advanced_settings.screen"
      isFullView
      backgroundColor={colors.gray5}
    >
      <Header title={t('notification:advanced_notifications_settings:screen_title')} />
      <ViewSpacing height={spacing.padding.large} />
      {Boolean(isLoading)
        ? renderLoading()
        : renderContent()}
      <SearchCommunityView
        isOpen={isOpenSearchCommunity}
        onClose={onCloseSearchCommunity}
        onPressItem={onPressCommuntiyItem}
      />
      <SearchGroupView
        isOpen={isOpenSearchGroups}
        onClose={onCloseSearchGrops}
        onPressItem={onPressItem}
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
    listFooter: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

const AdvancedSettings = React.memo(_AdvancedSettings);
// AdvancedSettings.whyDidYouRender = true;
export default AdvancedSettings;
