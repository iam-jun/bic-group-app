import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { IUserBadge } from '~/interfaces/IEditUser';
import spacing from '~/theme/spacing';

interface Props {
  style?: StyleProp<ViewStyle>;
  showingBadges?: IUserBadge[];
}

const UserBadge = ({ showingBadges = [], style }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  if (showingBadges.length === 0) return null;

  const renderItem = (item: any, index: number) => {
    if (!item?.id) return null;
    return (
      <>
        <Avatar.Small
          key={`badge_tooltip_avatar_${item.id}`}
          isRounded
          source={{ uri: item.iconUrl }}
        />
        {Boolean(index < showingBadges.length - 1) && <ViewSpacing width={spacing.margin.small} />}
      </>
    );
  };

  const badgesView = showingBadges.map((item, index) => renderItem(item, index));
  return (
    <View style={[styles.container, style]} testID="badges.view">
      {badgesView}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    tooltipStyle: {
      backgroundColor: colors.neutral80,
      borderRadius: spacing.padding.tiny,
      paddingVertical: spacing.padding.tiny,
      paddingHorizontal: spacing.padding.xSmall,
    },
  });
};

export default UserBadge;
