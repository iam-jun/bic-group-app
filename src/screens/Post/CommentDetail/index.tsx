import React, {useState, useEffect, useCallback} from 'react';
import {InteractionManager, View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import CommentDetailContent from './CommentDetailContent';
import CommentDetailContent2 from './CommentDetailContent2';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import postActions from '../redux/actions';

const CommentDetail = (props: any) => {
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);

  const [showPrivacyPost, setShowPricvacyPost] = useState(false);

  const backToNewsFeed = () => {
    rootNavigation.replace(homeStack.newsfeed);
  };

  useEffect(() => {
    return () => {
      dispatch(postActions.setCommentErrorCode(false));
    };
  }, []);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'post:label_comment'} />
      {/* <CommentDetailContent {...props} /> */}

      {showPrivacyPost ? (
        <EmptyScreen
          source={'iconLock'}
          size={120}
          title="post:text_restricted_permission"
          description="post:text_restricted_permission_description"
          ButtonComponent={
            <Button.Primary
              testID="comment_detail.back_to_news_feed"
              useI18n
              onPress={backToNewsFeed}
              style={styles.button}>
              post:text_back_to_news_feed
            </Button.Primary>
          }
        />
      ) : (
        <CommentDetailContent2
          {...props}
          showPrivacy={(value: boolean) => {
            setShowPricvacyPost(value);
          }}
        />
      )}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    button: {
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default CommentDetail;
