import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import BannerImportant from '~/baseComponents/Banner';

import Icon from '~/baseComponents/Icon';
import spacing from '~/theme/spacing';
import { checkExpiration } from '../../helper/postUtils';

export interface PostViewImportantProps {
  isImportant: boolean;
  expireTime: any;
  markedReadPost: boolean;
  isLite?: boolean;
}

const PostViewImportant: FC<PostViewImportantProps> = ({
  isImportant,
  expireTime,
  markedReadPost,
  isLite,
}: PostViewImportantProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const styles = createStyle(theme);

  if (!isImportant) {
    return null;
  }

  const isExpired = checkExpiration(expireTime);

  if (isLite) {
    return (
      <View
        testID="post_view.important_status_lite"
        style={styles.liteContainer}
      >
        <Icon
          size={12}
          icon="iconStar"
          iconStyle={styles.iconStar}
          tintColor={colors.purple50}
        />
      </View>
    );
  }

  if (isExpired && !isImportant) return null;

  return <BannerImportant markedAsRead={markedReadPost} />;
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    liteContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: colors.purple50,
      paddingHorizontal: spacing.padding.tiny,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.tiny,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
    iconStar: {
      backgroundColor: colors.white,
      borderRadius: spacing.borderRadius.small,
      padding: 2,
    },
  });
};

export default PostViewImportant;
