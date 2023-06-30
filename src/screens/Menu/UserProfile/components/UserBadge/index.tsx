import {
  FlatList,
  Platform,
  StatusBar,
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ImageStyle } from 'react-native-fast-image';
import Tooltip from 'react-native-walkthrough-tooltip';

import { IUserBadge } from '~/interfaces/IEditUser';
import UserBadgeItem from './UserBadgeItem';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Button from '~/baseComponents/Button';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  customStyleBadgeItem?: StyleProp<ImageStyle>;
  showingBadges?: IUserBadge[];
  isInMenuTab?: boolean;
  isCurrentUser?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onPress?: () => void;
}

const UserBadge = ({
  showingBadges = [],
  style,
  customStyleBadgeItem,
  isInMenuTab = false,
  isCurrentUser,
  placement = 'top',
  onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const [isVisibleIndex, setIsVisibleIndex] = useState(-1);

  if (showingBadges.length === 0 || !Boolean(showingBadges?.[0]?.id)) return null;

  const openTooltip = (index: number) => {
    setIsVisibleIndex(index);
  };

  const renderItem = ({ item, index }: any) => {
    if (!item?.id) {
      return (
        <Tooltip
          isVisible={Boolean(isVisibleIndex === index)}
          key={`badge_showing_item_empty_tooltip_${index}`}
          content={(
            <View style={styles.row}>
              <ViewSpacing width={spacing.margin.small} />
              <Text.SubtitleS color={colors.white} useI18n>user:badge_tooltip_placeholder</Text.SubtitleS>
              <ViewSpacing width={spacing.margin.small} />
            </View>
          )}
          placement={placement}
          backgroundColor="transparent"
          contentStyle={styles.tooltipStyle}
          disableShadow
          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
          onClose={() => { setIsVisibleIndex(-1); }}
        >
          <TouchableOpacity
            testID="user_badge_item.empty"
            style={styles.emptyItem}
            onLongPress={() => { openTooltip(index); }}
            onPress={onPress}
          >
            <Icon
              size={28}
              icon="CirclePlus"
              tintColor={theme.colors.neutral20}
            />
          </TouchableOpacity>
        </Tooltip>
      );
    }
    return (
      <UserBadgeItem
        key={`badge_showing_item_${item?.id}`}
        data={item}
        placement={isInMenuTab ? 'bottom' : 'top'}
        customStyleBadgeItem={customStyleBadgeItem}
      />
    );
  };

  const shouldShowFooter = Boolean(showingBadges?.[2]?.id) && isCurrentUser;

  const renderFooter = () => {
    if (!shouldShowFooter) return null;
    return (
      <Button.Secondary
        testID="user_badge_item.button_edit"
        type="ghost"
        icon="PenToSquare"
        size="small"
        onPress={onPress}
      />
    );
  };

  return (
    <View style={[styles.container, style]} testID="badges.view">
      <FlatList
        data={showingBadges}
        horizontal
        keyExtractor={(item, index) => `badge_showing_${item?.id}_${index}`}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={styles.buttonEdit}
        ItemSeparatorComponent={() => <ViewSpacing width={spacing.margin.small} />}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      height: 40,
    },
    buttonEdit: {
      marginLeft: spacing.margin.small,
    },
    emptyItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainerStyle: {
      alignItems: 'center',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.xSmall,
    },
    row: { flexDirection: 'row' },
  });
};

export default UserBadge;
