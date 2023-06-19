import React, { useCallback, useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Platform, StatusBar, DeviceEventEmitter,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import Tooltip from 'react-native-walkthrough-tooltip';

import { Avatar } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import spacing, { borderRadius } from '~/theme/spacing';
import { IUserBadge } from '~/interfaces/IEditUser';
import Text from '~/baseComponents/Text';
import useUserBadge from './store';
import BadgeNew from './BadgeNew';

interface Props {
  id: string;
  numColumns: number;
  index: number;
  disabled?: boolean;
  shouldHideBadgeNew?: boolean;
  onPress: (item: IUserBadge, isSelected: boolean) => void;
}

const GridItem = ({
  id, numColumns, index,
  disabled = false,
  shouldHideBadgeNew = false,
  onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);
  const actions = useUserBadge((state) => state.actions);
  const item = useUserBadge(useCallback((state) => state.badges?.[id], [id]));

  const [isVisible, setIsVisible] = useState(false);

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'off-tooltip',
        () => { setIsVisible(false); },
      );
      return () => {
        listener?.remove?.();
      };
    }, [],
  );

  const isSelected = checkIsSelected(choosingBadges, item);

  const onPressItem = () => {
    onPress(item, isSelected);
    actions.markNewBadge(id);
  };

  const onLongPress = () => {
    if (disabled) return;
    actions.markNewBadge(id);
    setIsVisible(true);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const shouldDisable = disabled && !isSelected;

  return (
    <Tooltip
      isVisible={isVisible}
      content={<Text.BodyS color={colors.white}>{item?.name || ''}</Text.BodyS>}
      placement="top"
      backgroundColor="transparent"
      contentStyle={styles.tooltipStyle}
      disableShadow
      topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      onClose={onClose}
    >
      <TouchableOpacity
        style={[styles.container,
        ]}
        disabled={shouldDisable}
        onPress={onPressItem}
        onLongPress={onLongPress}
      >
        <Avatar.Medium
          isRounded
          borderWidth={isSelected ? 2 : 1}
          borderColor={isSelected ? colors.purple50 : colors.neutral5}
          source={{ uri: item?.iconUrl }}
        />
        {Boolean(isSelected) && (
        <View style={styles.iconChose}>
          <Icon size={10} icon="Check" tintColor={colors.white} />
        </View>
        )}
        {Boolean(!isSelected) && Boolean(disabled) && <View style={styles.disabled} />}
        {Boolean(item?.isNew) && !Boolean(isSelected) && !Boolean(shouldHideBadgeNew) && (
          <View style={styles.badgeNewStyle}>
            <BadgeNew />
          </View>
        )}
      </TouchableOpacity>
    </Tooltip>
  );
};

const checkIsSelected = (choosingBadges: IUserBadge[], item: IUserBadge) => {
  const index = choosingBadges.findIndex((badge) => badge?.id === item?.id);
  return index !== -1;
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      margin: spacing.margin.xSmall,
      borderRadius: borderRadius.pill,
    },
    iconChose: {
      backgroundColor: colors.purple50,
      borderRadius: borderRadius.pill,
      height: 20,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 1,
      right: 0,
    },
    disabled: {
      backgroundColor: colors.white,
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: borderRadius.pill,
      opacity: 0.5,
      overflow: 'hidden',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.small,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    badgeNewStyle: {
      position: 'absolute',
      zIndex: 2,
      right: 0,
    },
  });
};

export default GridItem;
