import React, {useState, useEffect, useCallback} from 'react';
import {InteractionManager, View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import CommentDetailContent from './CommentDetailContent';

const CommentDetail = (props: any) => {
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
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'post:label_comment'} />
      {showContent && (
        <CommentDetailContent {...props} onContentLayout={onContentLayout} />
      )}
      {/* {showLoading && (
        <View style={styles.loadingContainer}>
          <PostViewPlaceholder />
        </View>
      )} */}
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

export default CommentDetail;
