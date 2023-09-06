import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useBaseHook } from '~/hooks';
import usePostsInProgressStore from './store';
import spacing from '~/theme/spacing';
import Divider from '~/beinComponents/Divider';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';

const VideoProcessingNotice = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const total = usePostsInProgressStore((state) => state.total);
  const hasNextPage = usePostsInProgressStore((state) => state.hasNextPage);
  const actions = usePostsInProgressStore((state) => state.actions);
  const showPlus = hasNextPage && total >= 10;

  const text = total > 1 ? t('home:notice_posts_video_uploading').replace(
    '{count}',
    `${total}${showPlus ? '+' : ''}`,
  ) : t('home:notice_post_video_uploading');

  const onClose = () => {
    actions.setTotal(0);
  };

  if (!total) return null;

  return (
    <>
      <Divider color={theme.colors.gray5} size={spacing.margin.large} />
      <View style={styles.container}>
        <Icon
          size={20}
          tintColor={theme.colors.neutral20}
          icon="CirclePlay"
        />
        <Text.BodyS style={styles.description} useI18n>
          {text}
        </Text.BodyS>
        <Button
          testID="notice_panel.button_close"
          style={styles.closeButton}
          activeOpacity={0.9}
          onPress={onClose}
        >
          <Icon
            size={14}
            tintColor={theme.colors.neutral80}
            icon="iconClose"
          />
        </Button>
      </View>
    </>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    description: {
      color: colors.neutral40,
      marginLeft: spacing.margin.tiny,
      flex: 1,
    },
    closeButton: {
      padding: spacing.padding.tiny,
    },
    container: {
      backgroundColor: colors.gray1,
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      flex: 1,
    },
  });
};

export default VideoProcessingNotice;
