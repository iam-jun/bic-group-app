import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Header from '~/beinComponents/Header';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostDetailContent from '~/screens/Post/PostDetail/PostDetailContent';
import {ITheme} from '~/theme/interfaces';

const PostDetail = (props: any) => {
  const [showLoading, setShowLoading] = useState(true);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onContentLayout = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <PostDetailContent {...props} onContentLayout={onContentLayout} />
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Header
            titleTextProps={{useI18n: true}}
            title={'post:title_post_detail'}
          />
          <PostViewPlaceholder />
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
