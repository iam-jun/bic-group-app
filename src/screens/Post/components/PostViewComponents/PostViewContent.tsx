import React, { FC, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { isEmpty } from 'lodash';

import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import { useRootNavigation } from '~/hooks/navigation';
import { IActivityDataImage, IMarkdownAudience } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import Image from '~/beinComponents/Image';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';

import Markdown from '~/beinComponents/Markdown';
import postKeySelector from '../../redux/keySelector';
import VideoPlayer from '~/beinComponents/VideoPlayer';
import UploadingFile from '~/beinComponents/UploadingFile';
import FilesView from '../FilesView';
import CopyableView from '~/beinComponents/CopyableView';
import { escapeMarkDown } from '~/utils/formatData';
import spacing from '~/theme/spacing';

export interface PostViewContentProps {
  postId: string;
  content?: string;
  images?: IActivityDataImage[];
  videos?: any[];
  files?: any[];
  isPostDetail: boolean;
  isLite?: boolean;
  isDraft?: boolean;
  onPressMarkSeenPost?: () => void;
}

const PostViewContent: FC<PostViewContentProps> = ({
  postId,
  content = '',
  images = [],
  videos = [],
  files = [],
  isPostDetail,
  isLite,
  isDraft,
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

  if (
    !content
    && (!images || images?.length === 0)
    && (!videos || videos?.length === 0)
    && isEmpty(files)
  ) {
    return null;
  }

  const renderContent = () => {
    if (isLite) {
      const imageName = images?.[0]?.name;
      const imageSource = images?.[0]?.url
        || (imageName
          ? imageName?.includes?.('http')
            ? imageName
            : getResourceUrl(
              'postImage', imageName,
            )
          : '');
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
              selector={`${postKeySelector.allPosts}.${postId}.mentions.users`}
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
            selector={`${postKeySelector.allPosts}.${postId}.mentions`}
            onPressAudience={onPressMentionAudience}
          />
        </CopyableView>
      );
    }
    return (
      <CollapsibleText
        testID="post_view_content"
        content={content}
        limitLength={400}
        shortLength={400}
        useMarkdown
        toggleOnPress
        copyEnabled
        selector={`${postKeySelector.allPosts}.${postId}.mentions`}
        onPressAudience={onPressMentionAudience}
        onToggleShowTextContent={onPressMarkSeenPost}
      />
    );
  };

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
            <VideoPlayer data={videos?.[0]} postId={postId} onWatchCheckPoint={onPressMarkSeenPost} />
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
});

export default PostViewContent;
