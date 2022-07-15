import React, {useCallback, useEffect, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import images from '~/resources/images';
import PostDetailContent from '~/screens/Post/PostDetail/PostDetailContent';

const PostDetail = (props: any) => {
  const [showContent, setShowContent] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);
  console.log('POST DETAIL>>>>>>>>>>>>>>>');

  useEffect(() => {
    const taskId = requestAnimationFrame(() => {
      setShowContent(true);
    });

    return () => cancelAnimationFrame(taskId);
  }, []);

  const onContentLayout = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral5}>
      {showContent && (
        <PostDetailContent {...props} onContentLayout={onContentLayout} />
      )}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Header
            titleTextProps={{useI18n: true}}
            title={'post:title_post_detail'}
            avatar={images.logo_bein}
          />
          <PostViewPlaceholder testID={'post_detail.post_view_placeholder'} />
        </View>
      )}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
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
