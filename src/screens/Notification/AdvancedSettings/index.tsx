import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

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
import { sizes } from '~/theme/dimension';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import useAdvancedNotiSettingsStore from './store';
import AdvancedSettingItem from '../components/AdvancedSettingItem';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import AdvancedSettingHeader from '../components/AdvancedSettingHeader';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import SearchCommunityView from './components/SearchCommunityView';
import SearchGroupView from './components/SearchGroupView';

const AdvancedSettings = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const [isOpenSearchCommunity, setIsOpenSearchCommunity] = useState(false);
  const [isOpenSearchGroups, setIsOpenSearchGroups] = useState(false);

  const { ids, actions, items } = useYourCommunitiesStore();
  const advancedSettingsActions = useAdvancedNotiSettingsStore((state) => state.actions);
  const isLoading = useAdvancedNotiSettingsStore((state) => state.isLoading);
  const isLoadingJoinedGroup = useAdvancedNotiSettingsStore((state) => state.isLoadingJoinedGroup);
  const isLoadingGroupSettings = useAdvancedNotiSettingsStore((state) => state.isLoadingGroupSettings);
  const joinedGroups = useAdvancedNotiSettingsStore((state) => state.joinedGroups);
  const selectedCommunity = useAdvancedNotiSettingsStore((state) => state.selectedCommunity);
  const comId = selectedCommunity?.communityId || selectedCommunity?.id;

  const communitySettingData: any = useAdvancedNotiSettingsStore(
    useCallback((state) => state.communityData?.[comId] || {}, [comId]),
  );
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
      };
    }, [],
  );

  const getData = () => {
    advancedSettingsActions.setIsLoading(true);
    actions.getYourCommunities(true);
  };

  useEffect(() => {
    if (selectedCommunity?.id) {
      const comID = selectedCommunity?.communityId || selectedCommunity?.id;
      advancedSettingsActions.getCommunitySettings(comID);
      advancedSettingsActions.getJoinedGroupFlat(comID, true);
    }
  }, [selectedCommunity?.id]);

  const onRefresh = () => {
    getData();
  };

  const onLoadMore = () => {
    if (!hasNextPage || isLoadingJoinedGroup) return;
    advancedSettingsActions.getJoinedGroupFlat(comId);
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

  const onPressItem = (item: any) => {
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
    <AdvancedSettingHeader
      onPressSearch={onOpenGroupSearch}
      onChangeToggle={onChangeToggle}
      onPressToShowBottomSheet={onOpenSearchCommunity}
    />
  );

  const renderItem = ({ item }: any) => {
    const isDisabled = !Boolean(communitySettingData?.enable)
     || isLoadingJoinedGroup || isLoadingGroupSettings;
    return (
      <AdvancedSettingItem
        isDisabled={isDisabled}
        item={item}
        onPress={onPressItem}
      />
    );
  };

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
        : (ids.length === 0 ? renderNothingToSetup()
          : (
            <FlatList
              data={joinedGroups}
              extraData={communitySettingData}
              scrollEventThrottle={16}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              StickyHeaderComponent={renderHeader}
              keyExtractor={(item) => `group.${item?.id}.${selectedCommunity?.id}`}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderListFooter}
              onEndReached={onLoadMore}
            />
          )
        )}
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

export default AdvancedSettings;
