import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import Avatar from '~/baseComponents/Avatar';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Icon from '~/baseComponents/Icon';
import SettingItemSkeleton from './SettingItemSkeleton';
import NotiSettingItem from './NotiSettingItem';
import useBaseHook from '~/hooks/baseHook';
import { INotiSettings } from '~/interfaces/INotification';

interface Props {
  onPressSearch: () => void;
  onPressToShowBottomSheet: () => void;
  onChangeToggle: (isChecked: boolean) => void;
}

const AdvancedSettingHeader = ({
  onPressSearch,
  onPressToShowBottomSheet,
  onChangeToggle,
}:Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const isLoadingCommunitySettings = useAdvancedNotiSettingsStore((state) => state.isLoadingCommunitySettings);
  const selectedCommunity = useAdvancedNotiSettingsStore((state) => state.selectedCommunity);
  const { icon, name } = selectedCommunity || {};
  const communitySettingData: any = useAdvancedNotiSettingsStore(
    (state) => state.communityData?.[selectedCommunity?.id] || {},
  );

  const defaultItem: INotiSettings = {
    title: t('notification:notification_settings:allow_notifications'),
    enable: communitySettingData?.enable || false,
    name: 'advanced_settings',
    order: 0,
  };

  return (
    <View>
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text.BodyS useI18n color={colors.neutral40}>
            notification:advanced_notifications_settings:content
          </Text.BodyS>
        </View>
        <View style={styles.communityContainer}>
          <Text.BadgeL useI18n color={colors.neutral80}>
            notification:advanced_notifications_settings:title_setup_community
          </Text.BadgeL>
          <ButtonWrapper onPress={onPressToShowBottomSheet}>
            <View style={[styles.dropdownContainer, styles.row]}>
              <Avatar.Tiny source={icon} />
              <ViewSpacing width={spacing.margin.xSmall} />
              <Text.BodyS numberOfLines={1} style={styles.flex1}>
                {isEmpty(selectedCommunity)
                  ? t('common:text_loading')
                  : name || ''}
              </Text.BodyS>
              <Icon icon="AngleDown" size={16} />
            </View>
          </ButtonWrapper>
        </View>
        {Boolean(isLoadingCommunitySettings)
          ? <SettingItemSkeleton />
          : (
            <NotiSettingItem
              item={defaultItem}
              iconName="Bell"
              onPressToggle={onChangeToggle}
            />
          )}
      </View>
      <ViewSpacing height={spacing.margin.large} />
      <View style={styles.communityContainer}>
        <View style={[!Boolean(communitySettingData?.enable) ? styles.disable : {}]}>
          <Text.BadgeL useI18n color={colors.neutral80}>
            notification:advanced_notifications_settings:title_setup_group
          </Text.BadgeL>
          <Text.BodyS useI18n color={colors.neutral40}>
            notification:advanced_notifications_settings:description_setup_group
          </Text.BodyS>
        </View>
        <ViewSpacing height={spacing.margin.small} />
        <ButtonWrapper
          activeOpacity={0.85}
          disabled={!Boolean(communitySettingData?.enable)}
          onPress={onPressSearch}
          style={[styles.flex1, !Boolean(communitySettingData?.enable) ? styles.disable : {}]}
        >
          <View style={[styles.searchContainer, styles.row]}>
            <Icon
              testID="search_input.icon"
              icon="search"
              size={18}
              tintColor={colors.neutral20}
            />
            <ViewSpacing width={spacing.margin.small} />
            <Text.BodyS useI18n>
              notification:advanced_notifications_settings:search_group_placeholder
            </Text.BodyS>
          </View>
        </ButtonWrapper>
      </View>
    </View>
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
    headerContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
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
    disable: {
      backgroundColor: colors.white,
      opacity: 0.6,
    },
    searchContainer: {
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.extraLarge + spacing.borderRadius.large,
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
  });
};

export default AdvancedSettingHeader;
