import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import BannerImportant from '~/bicComponents/Banner/BannerImportant';

import Icon from '~/beinComponents/Icon';
import spacing from '~/theme/spacing';

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

  if (!isImportant || !expireTime) {
    return null;
  }

  const now = new Date();
  const notExpired = now.getTime() < new Date(expireTime).getTime();

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

  return notExpired ? <BannerImportant markedAsRead={markedReadPost} /> : null;
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
