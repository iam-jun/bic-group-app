import {
  StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IPostCommunities } from '~/interfaces/IPost';

import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import { getCommunitiesText } from '~/helpers/post';
import { useBaseHook } from '~/hooks';
import { Button } from '~/baseComponents';

interface BannerImportantProps {
  style?: StyleProp<ViewStyle>;
  markedAsRead?: boolean;
  isImportant?: boolean;
  isExpired?: boolean;
  listCommunity?: IPostCommunities[];
  shouldBeHidden?: boolean;
  onPressBanner?: any;
}

const BannerImportant = ({
  style,
  markedAsRead,
  isImportant,
  isExpired,
  listCommunity = [],
  shouldBeHidden = false,
  onPressBanner,
}: BannerImportantProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();
  const { colors } = theme;
  const { t } = useBaseHook();
  const textCommunity = getCommunitiesText(listCommunity || [], t);

  const importantStyles = {
    active: {
      textColor: colors.purple50,
      backgroundColor: colors.purple5,
      iconColor: colors.purple50,
    },
    inactive: {
      textColor: colors.neutral40,
      backgroundColor: colors.neutral10,
      iconColor: colors.neutral40,
    },
  };

  const {
    textColor,
    backgroundColor,
    iconColor,
  } = isImportant ? (markedAsRead ? importantStyles.inactive : importantStyles.active)
    : importantStyles.inactive;

  const renderImportant = () => {
    if (!isImportant || (isExpired && !isImportant)) {
      return null;
    }
    return (
      <Icon
        icon="StarSolid"
        size={14}
        tintColor={iconColor}
      />
    );
  };

  if (shouldBeHidden) return null;

  if (!isImportant && (!listCommunity || listCommunity?.length === 0)) return null;

  return (
    <Button
      style={[styles.container, { backgroundColor }, style]}
      onPress={onPressBanner}
    >
      <Text.SubtitleXS color={textColor}>
        {textCommunity}
      </Text.SubtitleXS>
      {renderImportant()}
    </Button>
  );
};

export default BannerImportant;

const createStyles = () => StyleSheet.create({
  container: {
    paddingVertical: spacing.padding.xSmall,
    paddingHorizontal: spacing.padding.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
