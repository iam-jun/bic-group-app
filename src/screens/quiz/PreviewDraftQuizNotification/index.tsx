import React, { useEffect } from 'react';
import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';
import { RefreshControl, ScrollView } from 'react-native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import { PostType } from '~/interfaces/IPost';
import ContentItem from '~/components/ContentItem';
import postsSelector from '~/store/entities/posts/selectors';
import { QuizStatus } from '~/interfaces/IQuiz';
import { useRootNavigation } from '~/hooks/navigation';

interface PreviewDraftQuizNotificationProps {
  route?: {
    params?: {
      quizId?: string;
      contentId?: string;
      contentType?: PostType;
    };
  };
}

const PreviewDraftQuizNotification: React.FC<PreviewDraftQuizNotificationProps> = ({
  route,
}) => {
  const { contentId, contentType } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();
  const isFocused = useIsFocused();

  const postActions = usePostsStore((state) => state.actions);
  const deleted = usePostsStore(postsSelector.getDeleted(contentId));
  const data = usePostsStore(postsSelector.getPost(contentId, {}));
  const articleActions = useArticlesStore((state) => state.actions);

  const { quiz } = data || {};
  const { status } = quiz || {};
  const shouldShowDraftQuiz = status !== QuizStatus.PUBLISHED;

  useEffect(() => {
    getDataDetail();
  }, [contentId, contentType]);

  useEffect(() => {
    if (deleted && isFocused) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    }
  }, [deleted, isFocused]);

  const getDataDetail = () => {
    if (contentType === PostType.POST) {
      postActions.getPostDetail({ postId: contentId });
    }
    if (contentType === PostType.ARTICLE) {
      articleActions.getArticleDetail({ articleId: contentId });
    }
  };

  const onRefresh = () => {
    getDataDetail();
  };

  const renderContent = () => {
    if (!quiz && !deleted) return null;

    return (
      <ContentItem
        id={contentId}
        shouldShowDraftQuiz={shouldShowDraftQuiz}
      />
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.neutral5} testID="preview_draft_quiz_notification.content">
      <Header />
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        )}
      >
        {renderContent()}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PreviewDraftQuizNotification;
