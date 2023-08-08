import { isEmpty, isEqual } from 'lodash';
import React, {
  FC, memo, useMemo, useRef,
} from 'react';
import { StyleSheet, View } from 'react-native';

import CollapsibleText from '~/baseComponents/Text/CollapsibleText';
import PostPhotoPreview from '~/components/posts/PostPhotoPreview';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { useRootNavigation } from '~/hooks/navigation';
import { IMarkdownAudience, IPost, PostStatus } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import CopyableView from '~/beinComponents/CopyableView';
import Markdown from '~/beinComponents/Markdown';
import UploadingFile from '~/beinComponents/UploadingFile';
import { ContentInterestedUserCount } from '~/components/ContentView';
import FilesView from '~/components/FilesView';
import LinkPreview from '~/components/LinkPreview';
import appConfig from '~/configs/appConfig';
import spacing from '~/theme/spacing';
import { escapeMarkDown } from '~/utils/formatter';
import PostVideoPlayer from '../PostVideoPlayer';
import { ITag } from '~/interfaces/ITag';
import useCommunitiesStore from '~/store/entities/communities';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import TagsView from '~/components/TagsView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import TakePartInAQuiz from '~/components/quiz/TakePartInAQuiz';

export interface PostBodyProps {
  data: IPost;
  isLite?: boolean;
  isEmptyPost?: boolean;
  isPostDetail: boolean;
  shouldShowDraftQuiz?: boolean;

  onPressMarkSeenPost?: () => void;
}

const _PostBody: FC<PostBodyProps> = ({
  data,
  isLite,
  isEmptyPost,
  isPostDetail,
  shouldShowDraftQuiz,

  onPressMarkSeenPost,
}: PostBodyProps) => {
  const { rootNavigation } = useRootNavigation();

  const {
    id: postId, mentions, status, media, content: postContent, highlight, linkPreview, totalUsersSeen, tags, quiz,
    quizHighestScore, audience, actor,
  } = data;

  const { images, videos, files } = media || {};

  const content = isLite && highlight ? highlight : postContent;

  const onPressMentionAudience = useRef((audience: IMarkdownAudience) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: audience.id },
      );
    }
  }).current;

  const BottomRightComponent = useMemo(() => {
    if (status === PostStatus.DRAFT) return null;

    return (
      <ContentInterestedUserCount
        id={postId}
        interestedUserCount={totalUsersSeen}
        style={styles.interestedUserCount}
      />
    );
  }, [status, postId, totalUsersSeen]);

  const goToTagDetail = (tagData: ITag) => {
    const communityId = useCommunitiesStore.getState().currentCommunityId;
    rootNavigation.navigate(tagsStack.tagDetail, { tagData, communityId });
  };

  const renderContent = () => {
    if (isLite) {
      return (
        <CollapsibleText
          testID="post_view_content"
          content={content}
          limitLength={appConfig.limitPostContentLength}
          shortLength={appConfig.shortPostContentLength}
          useMarkdown
          useMarkdownIt
          limitMarkdownTypes
          mentions={mentions}
          onPressAudience={onPressMentionAudience}
          onToggleShowTextContent={onPressMarkSeenPost}
        />
      );
    }

    if (isPostDetail) {
      return (
        <CopyableView content={escapeMarkDown(content)}>
          <Markdown
            value={content}
            mentions={mentions}
            onPressAudience={onPressMentionAudience}
          />
        </CopyableView>
      );
    }

    return (
      <CollapsibleText
        testID="post_view_content"
        useMarkdown
        toggleOnPress
        copyEnabled
        content={content}
        mentions={mentions}
        shortLength={appConfig.shortPostContentLength}
        limitLength={appConfig.limitPostContentLength}
        BottomRightComponent={BottomRightComponent}
        onPressAudience={onPressMentionAudience}
        onToggleShowTextContent={onPressMarkSeenPost}
      />
    );
  };

  if (isEmptyPost) return null;

  const hasNoAttachment = isEmpty(images) && isEmpty(videos) && isEmpty(files);
  /* only show link previewer when there aren't any attachments */
  const isShowLinkPreviewer = hasNoAttachment && !!linkPreview;

  const isShowVideoPlayer = videos?.[0]?.thumbnails?.length > 0;

  return (
    <View>
      <View style={styles.contentContainer}>
        {renderContent()}
        {tags?.length > 0 && (
          <>
            <TagsView data={tags} onPressTag={goToTagDetail} />
            <ViewSpacing height={8} />
          </>
        )}
      </View>
      <>
        <PostPhotoPreview
          data={images}
          uploadType={ResourceUploadType.postContent}
          enableGalleryModal
          onPressMarkSeenPost={onPressMarkSeenPost}
        />
        {isShowVideoPlayer ? (
          <PostVideoPlayer
            data={videos?.[0]}
            postId={postId}
            onWatchCheckPoint={onPressMarkSeenPost}
          />
        ) : (
          <UploadingFile
            uploadType={ResourceUploadType.postVideo}
            file={videos?.[0]}
            disableClose
          />
        )}
        <FilesView
          files={files}
          disableClose
          showDownload
          onPressDownload={onPressMarkSeenPost}
          collapsible={!isPostDetail}
        />
        {isShowLinkPreviewer && <LinkPreview data={linkPreview} />}
        {!isLite && (
          <TakePartInAQuiz
            quiz={quiz}
            contentId={postId}
            quizHighestScore={quizHighestScore}
            audience={audience}
            actor={actor}
            shouldShowDraftQuiz={shouldShowDraftQuiz}
          />
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  contentContainer: {
    marginVertical: spacing.margin.small,
    marginHorizontal: spacing.margin.large,
  },
  imageLite: {
    width: 120,
    height: 120,
    borderRadius: spacing.borderRadius.small,
  },
  interestedUserCount: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    margin: 0,
    alignItems: 'flex-end',
  },
});

function propsAreEqual(
  prev: any, next: any,
) {
  return isEqual(
    prev, next,
  );
}

const PostBody = memo(_PostBody, propsAreEqual);
PostBody.whyDidYouRender = true;
export default PostBody;
