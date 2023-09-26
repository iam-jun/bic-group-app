import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import { BoxScheduleTime } from '~/components/ScheduleContent';
import postsSelector from '~/store/entities/posts/selectors';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { PostView } from '~/components/posts';
import { IPayloadPutEditPost } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import { PlaceHolderRemoveContent } from '~/baseComponents';
import PostViewPlaceholder from '~/components/placeholder/PostViewPlaceholder';

interface PostReviewScheduleProps {
  route?: {
    params?: {
      postId: string;
    };
  };
}

const PostReviewSchedule: React.FC<PostReviewScheduleProps> = (props) => {
  const { route } = props;
  const { postId } = route.params || {};
  const [publishing, setPublishing] = useState(false);

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const postActions = usePostsStore((state) => state.actions);
  const data = usePostsStore(postsSelector.getPost(postId, {}));
  const postDetailLoadingState = usePostsStore(
    (state) => state.isLoadingGetPostDetail,
  );

  const {
    scheduledAt,
    status,
    deleted,
  } = data || {};

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    postActions.getPostDetail({ postId });
  };

  const onPressPublish = () => {
    if (postId) {
      setPublishing(true);
      const payload: IPayloadPutEditPost = {
        id: postId,
        disableNavigate: false,
        isPublish: true,
        onError: () => setPublishing(false),
        isHandleSeriesTagsError: false,
      };
      postActions.putEditPost(payload);
    }
  };

  const handleBack = () => {
    if (deleted) {
      // schedulePostActions.getSchedulePost({ isRefresh: true });
    }
    rootNavigation.goBack();
  };

  if (deleted) {
    return (
      <ScreenWrapper
        isFullView
        testID="post_review_schedule"
        backgroundColor={colors.neutral5}
      >
        <Header
          onPressBack={handleBack}
          titleTextProps={{ useI18n: true }}
          title="post:title_post_review_schedule"
        />
        <PlaceHolderRemoveContent label="post:label_post_deleted" />
      </ScreenWrapper>
    );
  }

  const renderContent = () => {
    if (postDetailLoadingState) {
      return (
        <PostViewPlaceholder testID="post_review_schedule.post_view_placeholder" />
      );
    }

    return <PostView data={data} />;
  };

  return (
    <ScreenWrapper
      isFullView
      testID="post_review_schedule"
      backgroundColor={colors.neutral5}
    >
      <Header
        titleTextProps={{ useI18n: true }}
        title="post:title_post_review_schedule"
        buttonProps={{
          loading: publishing,
          disabled: publishing,
          style: styles.btnPublish,
          useI18n: true,
        }}
        buttonText="common:btn_publish"
        onPressButton={onPressPublish}
        removeBorderAndShadow
      />
      <BoxScheduleTime
        scheduledAt={scheduledAt}
        status={status}
        isBorderTop
        isMarginBottom
      />
      <ScrollView>
        {renderContent()}
        <ViewSpacing height={spacing.margin.big} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  btnPublish: {
    marginRight: spacing.margin.small,
  },
});

export default PostReviewSchedule;
