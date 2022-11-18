import { isEmpty } from 'lodash';
import React, { FC, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PostPhotoPreview from '~/components/posts/PostPhotoPreview';
import { uploadTypes } from '~/configs/resourceConfig';
import { useRootNavigation } from '~/hooks/navigation';
import { IMarkdownAudience } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import CopyableView from '~/beinComponents/CopyableView';
import Markdown from '~/beinComponents/Markdown';
import UploadingFile from '~/beinComponents/UploadingFile';
import { ContentInterestedUserCount } from '~/components/ContentView';
import FilesView from '~/components/FilesView';
import LinkPreview from '~/components/LinkPreview';
import appConfig from '~/configs/appConfig';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import spacing from '~/theme/spacing';
import { escapeMarkDown } from '~/utils/formatData';
import PostVideoPlayer from '../PostVideoPlayer';

export interface PostBodyProps {
  postId: string;
  isLite?: boolean;
  isEmptyPost?: boolean;
  isPostDetail: boolean;
  onPressMarkSeenPost?: () => void;
}

const PostBody: FC<PostBodyProps> = ({
  postId,
  isLite,
  isEmptyPost,
  isPostDetail,
  onPressMarkSeenPost,
}: PostBodyProps) => {
  const { rootNavigation } = useRootNavigation();

  const mentions = usePostsStore(useCallback(postsSelector.getMentions(postId), [postId]));
  const isDraft = usePostsStore(useCallback(postsSelector.getIsDraft(postId), [postId]));
  const media = usePostsStore(useCallback(postsSelector.getMedia(postId), [postId]));
  const postContent = usePostsStore(useCallback(postsSelector.getContent(postId), [postId]));
  const highlight = usePostsStore(useCallback(postsSelector.getHighlight(postId), [postId]));
  const linkPreview = usePostsStore(useCallback(postsSelector.getLinkPreview(postId), [postId]));
  const totalUsersSeen = usePostsStore(useCallback(postsSelector.getTotalUsersSeen(postId), [postId]));

  const { images, videos, files } = media || {};

  const content = isLite && highlight ? highlight : postContent;

  const onPressMentionAudience = useRef((audience: IMarkdownAudience) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: audience.id },
      );
    }
  }).current;

  const renderBottomRightComponent = useCallback(() => {
    if (isLite) return null;

    return (
      <ContentInterestedUserCount
        isLite
        id={postId}
        interestedUserCount={totalUsersSeen}
        style={styles.interestedUserCount}
      />
    );
  }, []);

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
          BottomRightComponent={!isDraft && renderBottomRightComponent()}
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
        content={content}
        limitLength={appConfig.limitPostContentLength}
        shortLength={appConfig.shortPostContentLength}
        useMarkdown
        toggleOnPress
        copyEnabled
        mentions={mentions}
        onPressAudience={onPressMentionAudience}
        onToggleShowTextContent={onPressMarkSeenPost}
        BottomRightComponent={!isDraft && renderBottomRightComponent()}
      />
    );
  };

  if (isEmptyPost) return null;

  const hasNoAttachment = isEmpty(images) && isEmpty(videos) && isEmpty(files);
  /* only show link previewer when there aren't any attachments */
  const showLinkPreviewer = hasNoAttachment && !!linkPreview;

  const isShowVideoPlayer = videos?.[0]?.thumbnails?.length > 0;

  return (
    <View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <>
        <PostPhotoPreview
          data={images || []}
          uploadType="postImage"
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
            uploadType={uploadTypes.postVideo}
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
        {showLinkPreviewer && <LinkPreview data={linkPreview} />}
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

export default PostBody;
