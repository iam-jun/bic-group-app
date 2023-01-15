import React, {
  useState, useEffect, FC, useCallback,
} from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import CommentDetailContent from './CommentDetailContent';
import EmptyScreen from '~/components/EmptyScreen';
import Button from '~/beinComponents/Button';
import { useRootNavigation } from '~/hooks/navigation';
import postActions from '../../../storeRedux/post/actions';
import { useKeySelector } from '~/hooks/selector';
import APIErrorCode from '~/constants/apiErrorCode';
import postKeySelector from '../../../storeRedux/post/keySelector';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { IRouteParams } from '~/interfaces/IRouter';
import { getTitle, replacePostDetail } from './helper';

const CommentDetail: FC<IRouteParams> = (props) => {
  const params = props?.route?.params;
  const { postId, commentId } = params || {};

  const { rootNavigation, goHome } = useRootNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const actor = usePostsStore(postsSelector.getActor(postId));
  const type = usePostsStore(postsSelector.getType(postId));
  const copyCommentError = useKeySelector(postKeySelector.commentErrorCode);
  const [showPrivacyPost, setShowPrivacyPost] = useState(false);
  const comment = useCommentsStore(useCallback(commentsSelector.getComment(commentId), [commentId]));
  const { reported } = comment || {};

  useEffect(() => {
    if (reported && isFocused) {
      setTimeout(() => {
        onBack();
      }, 200);
    }
  }, [reported, isFocused]);

  const backToNewsFeed = () => {
    goHome();
  };

  const goToPostDetail = () => {
    replacePostDetail(type, postId);
  };

  const headerTitle = t(getTitle(type), {
    name: actor?.fullname || '',
  });

  useEffect(
    () => () => {
      dispatch(postActions.setCommentErrorCode(false));
      dispatch(postActions.setLoadingGetPostDetail(false));
    },
    [],
  );

  useEffect(
    () => () => {
      if (copyCommentError === APIErrorCode.Post.COMMENT_DELETED) {
        const params = props?.route?.params;
        const { postId, commentId } = params || {};
        dispatch(postActions.removeCommentLevel1Deleted({ postId, commentId }));
      }
    },
    [copyCommentError],
  );

  const onBack = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      replacePostDetail(type, postId);
    }
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral5}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="post:label_comment"
        subTitle={(
          <Text.SubtitleXS>
            {`${t('common:in')} `}
            <Text.SubtitleXS
              onPress={goToPostDetail}
              suppressHighlighting
              style={styles.highlightText}
            >
              {headerTitle}
            </Text.SubtitleXS>
          </Text.SubtitleXS>
        )}
        onPressBack={onBack}
      />

      {showPrivacyPost ? (
        <EmptyScreen
          icon="iconLock"
          size={120}
          title="post:text_restricted_permission"
          description="post:text_restricted_permission_description"
          ButtonComponent={(
            <Button.Primary
              testID="comment_detail.back_to_news_feed"
              useI18n
              onPress={backToNewsFeed}
              style={styles.button}
            >
              post:text_back_to_news_feed
            </Button.Primary>
          )}
        />
      ) : (
        <CommentDetailContent
          {...props}
          showPrivacy={(value: boolean) => {
            setShowPrivacyPost(value);
          }}
        />
      )}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    button: {
      marginTop: spacing.margin.extraLarge,
    },
    highlightText: {
      color: colors.blue50,
    },
  });
};
export default CommentDetail;
