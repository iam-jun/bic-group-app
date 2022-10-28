import React, { FC, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { isEmpty } from 'lodash';

import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import { useRootNavigation } from '~/hooks/navigation';
import { IActivityDataImage, ILinkPreview, IMarkdownAudience } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import PostPhotoPreview from '~/screens/post/components/PostPhotoPreview';
import Image from '~/beinComponents/Image';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';

import Markdown from '~/beinComponents/Markdown';
import UploadingFile from '~/beinComponents/UploadingFile';
import FilesView from '~/components/FilesView';
import CopyableView from '~/beinComponents/CopyableView';
import { escapeMarkDown } from '~/utils/formatData';
import spacing from '~/theme/spacing';
import PostVideoPlayer from '../PostVideoPlayer';
import LinkPreview from '~/components/LinkPreview';
import appConfig from '~/configs/appConfig';
import ContentInterestedUserCount from '~/components/ContentView/components/ContentInterestedUserCount';

export interface PostViewContentProps {
  postId: string;
  isEmptyPost?: boolean;
  content?: string;
  images?: IActivityDataImage[];
  videos?: any[];
  files?: any[];
  isPostDetail: boolean;
  isLite?: boolean;
  isDraft?: boolean;
  mentions?: any;
  linkPreview?: ILinkPreview;
  totalUsersSeen?: number;
  onPressMarkSeenPost?: () => void;
}

const PostViewContent: FC<PostViewContentProps> = ({
  postId,
  isEmptyPost,
  content = '',
  images = [],
  videos = [],
  files = [],
  isPostDetail,
  isLite,
  isDraft,
  mentions,
  linkPreview,
  totalUsersSeen,
  onPressMarkSeenPost,
}: PostViewContentProps) => {
  const { rootNavigation } = useRootNavigation();

  const onPressMentionAudience = useRef((audience: IMarkdownAudience) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: audience.id },
      );
    }
  }).current;

  const renderInterestedUser = () => (
    <ContentInterestedUserCount
      id={postId}
      interestedUserCount={totalUsersSeen}
      style={styles.interestedUserCount}
      isLite
    />
  );

  const renderContent = () => {
    if (isLite) {
      const imageName = images?.[0]?.name;
      const imageUrl = images?.[0]?.url;
      const isNetworkImage = typeof imageName === 'string' && imageName?.startsWith?.('http');
      const imageSourceFromName = isNetworkImage
        ? imageName
        : getResourceUrl('postImage', imageName);

      const imageSource = imageUrl || imageSourceFromName || '';

      return (
        <View testID="post_view_content.lite_container" style={styles.row}>
          <View style={styles.flex1}>
            <CollapsibleText
              testID="post_view_content"
              content={content}
              limitLength={400}
              shortLength={400}
              useMarkdown
              useMarkdownIt
              limitMarkdownTypes
              mentions={mentions}
              BottomRightComponent={renderInterestedUser()}
              onPressAudience={onPressMentionAudience}
              onToggleShowTextContent={onPressMarkSeenPost}
            />
          </View>
          {!!imageSource && (
            <Image style={styles.imageLite} source={imageSource} />
          )}
        </View>
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
        BottomRightComponent={renderInterestedUser()}
      />
    );
  };

  if (isEmptyPost) return null;

  return (
    <View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      {!isLite && (
        <>
          <PostPhotoPreview
            data={images || []}
            uploadType="postImage"
            enableGalleryModal
            onPressMarkSeenPost={onPressMarkSeenPost}
          />
          {!isDraft && videos?.[0]?.thumbnails?.length > 0 ? (
            <PostVideoPlayer data={videos?.[0]} postId={postId} onWatchCheckPoint={onPressMarkSeenPost} />
          ) : (
            <UploadingFile
              uploadType={uploadTypes.postVideo}
              file={videos?.[0]}
              disableClose
            />
          )}

          {/* only show link previewer when there aren't any attachments */}
          {(!images || images?.length === 0)
          && (!videos || videos?.length === 0)
          && isEmpty(files)
          && !!linkPreview
          && <LinkPreview data={linkPreview} />}

          <FilesView
            files={files}
            disableClose
            showDownload
            onPressDownload={onPressMarkSeenPost}
            collapsible={!isPostDetail}
          />
        </>
      )}
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

export default PostViewContent;
