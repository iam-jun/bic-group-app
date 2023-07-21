import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { RefreshControl, ScrollView } from 'react-native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import { PostType } from '~/interfaces/IPost';
import QuizPostView from '~/screens/quiz/YourQuiz/components/QuizPostView';
import postsSelector from '~/store/entities/posts/selectors';
import { QuizStatus } from '~/interfaces/IQuiz';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

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
  const { contentId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();

  const actions = usePostsStore((state) => state.actions);
  const data = usePostsStore(postsSelector.getPost(contentId, {}));

  const { quiz } = data || {};
  const { status } = quiz || {};

  useEffect(() => {
    actions.getPostDetail({ postId: contentId });
  }, [contentId]);

  useEffect(() => {
    if (status === QuizStatus.PUBLISHED) {
      rootNavigation.replace(homeStack.postDetail, { post_id: contentId });
    }
  }, [data]);

  const onRefresh = () => {
    actions.getPostDetail({ postId: contentId });
  };

  const renderContent = () => {
    if (status === QuizStatus.PUBLISHED) return null;

    return (<QuizPostView data={data} />);
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
