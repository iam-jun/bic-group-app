import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostDetailContent from './components/PostDetailContent';

const PostDetail = (props: any) => {
  const [showContent, setShowContent] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const params = props?.route?.params;
  const { is_reported: isReported = false } = params || {};

  useEffect(
    () => {
      const taskId = requestAnimationFrame(() => {
        setShowContent(true);
      });

      return () => cancelAnimationFrame(taskId);
    }, [],
  );

  const onContentLayout = useCallback(
    () => {
      setShowLoading(false);
    }, [],
  );

  const renderTitle = () => {
    if (isReported) {
      return 'report:title';
    }
    return 'post:title_post_detail';
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral5}>
      {showContent && (
        <PostDetailContent {...props} onContentLayout={onContentLayout} />
      )}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Header
            titleTextProps={{ useI18n: true }}
            title={renderTitle()}
          />
          <PostViewPlaceholder testID="post_detail.post_view_placeholder" />
        </View>
      )}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.neutral5,
      zIndex: 10,
    },
  });
};

export default PostDetail;
