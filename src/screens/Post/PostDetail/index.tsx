import React, {useState, useEffect, useCallback} from 'react';
import PostDetailContent from '~/screens/Post/PostDetail/PostDetailContent';
import {InteractionManager, View, StyleSheet} from 'react-native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import {Platform} from 'react-native';
import images from '~/resources/images';

const PostDetail = (props: any) => {
  const [showContent, setShowContent] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowContent(true);
    });
  }, []);

  const onContentLayout = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      {showContent && (
        <PostDetailContent {...props} onContentLayout={onContentLayout} />
      )}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Header
            titleTextProps={{useI18n: true}}
            title={'post:title_post_detail'}
            avatar={Platform.OS === 'web' ? undefined : images.logo_bein}
          />
          <PostViewPlaceholder testID={'post_detail.post_view_placeholder'} />
        </View>
      )}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.placeholder,
      zIndex: 10,
    },
  });
};

export default PostDetail;
