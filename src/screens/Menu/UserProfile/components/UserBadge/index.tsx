import {
  FlatList,
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ImageStyle } from 'react-native-fast-image';

import { IUserBadge } from '~/interfaces/IEditUser';
import UserBadgeItem from './UserBadgeItem';
import spacing from '~/theme/spacing';
import Button from '~/baseComponents/Button';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import UserBadgePlaceHolderItem from './UserBadgePlaceHolderItem';

interface Props {
  style?: StyleProp<ViewStyle>;
  customStyleBadgeItem?: StyleProp<ImageStyle>;
  showingBadges?: IUserBadge[];
  isInMenuTab?: boolean;
  isCurrentUser?: boolean;
  isTopAdjustment?: boolean;
  onPress?: () => void;
}

const UserBadge = ({
  showingBadges = [],
  style,
  customStyleBadgeItem,
  isInMenuTab = false,
  isCurrentUser,
  isTopAdjustment,
  onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  if (showingBadges.length === 0 || !Boolean(showingBadges?.[0]?.id)) return null;

  const renderItem = ({ item }: any) => {
    if (!item?.id) {
      return (
        <UserBadgePlaceHolderItem
          placement={isInMenuTab ? 'bottom' : 'top'}
          onPress={onPress}
        />
      );
    }
    return (
      <UserBadgeItem
        key={`badge_showing_item_${item?.id}`}
        data={item}
        placement={isInMenuTab ? 'bottom' : 'top'}
        customStyleBadgeItem={customStyleBadgeItem}
        isTopAdjustment={isTopAdjustment}
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

const themeStyles = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    height: 40,
  },
  buttonEdit: {
    marginLeft: spacing.margin.small,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});

export default UserBadge;
