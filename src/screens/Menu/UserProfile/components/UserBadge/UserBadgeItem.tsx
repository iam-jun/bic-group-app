import React, { useState } from 'react';
import {
  TouchableOpacity, StyleSheet, Platform, StatusBar,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';

import { Avatar } from '~/baseComponents';
import { IUserBadge } from '~/interfaces/IEditUser';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';

interface Props {
  data: IUserBadge;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const UserBadgeItem = ({
  data, placement = 'top',
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const [isVisible, setIsVisible] = useState(false);

  if (!data?.id) return null;
  return (
    <Tooltip
      isVisible={isVisible}
      content={(
        <>
          <Text.SubtitleS color={colors.white}>{data?.name || ''}</Text.SubtitleS>
          <Text.BodyS color={colors.neutral20}>{data?.community?.name || ''}</Text.BodyS>
        </>
          )}
      placement={placement}
      backgroundColor="transparent"
      contentStyle={styles.tooltipStyle}
      disableShadow
      topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      onClose={() => { setIsVisible(false); }}
    >
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}
      >
        <Avatar.Small
          key={`badge_tooltip_avatar_${data.id}`}
          isRounded
          source={{ uri: data.iconUrl }}
        />
      </TouchableOpacity>
    </Tooltip>
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

export default UserBadgeItem;
