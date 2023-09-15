import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import usePostsStore from '~/store/entities/posts';
import { BoxScheduleTime } from '~/components/ScheduleContent/components';
import postsSelector from '~/store/entities/posts/selectors';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { PostView } from '~/components/posts';
import { IPayloadPutEditPost } from '~/interfaces/IPost';

interface PostReviewScheduleProps {
  route?: {
    params?: {
      postId: string;
    };
  };
}

const PostReviewSchedule: React.FC<PostReviewScheduleProps> = (props) => {
  const { route } = props;
  // const { postId } = route.params || {};
  const postId = 'bafbcbd3-3faf-4549-be83-7038577447b4';
  const [publishing, setPublishing] = useState(false);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const postActions = usePostsStore((state) => state.actions);
  const data = usePostsStore(postsSelector.getPost(postId, {}));

  const {
    scheduledAt,
    status,
  } = data || {};

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = () => {
    getData();
  };
  
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
          useI18n: true
        }}
        buttonText={('common:btn_publish')}
        onPressButton={onPressPublish}
        removeBorderAndShadow
      />
      <BoxScheduleTime
        scheduledAt={scheduledAt}
        status={status}
        isBorderTop
      />
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        )}
      >
        <ViewSpacing height={spacing.margin.large} />
        <PostView data={data} isSchedule />
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
