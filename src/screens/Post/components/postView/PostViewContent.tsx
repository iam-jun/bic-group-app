import React, {FC, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import {useRootNavigation} from '~/hooks/navigation';
import {IActivityDataImage, IMarkdownAudience} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import Image from '~/beinComponents/Image';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';

import {ITheme} from '~/theme/interfaces';
import Markdown from '~/beinComponents/Markdown';
import postKeySelector from '../../redux/keySelector';
import VideoPlayer from '~/beinComponents/VideoPlayer';
import UploadingFile from '~/beinComponents/UploadingFile';

export interface PostViewContentProps {
  postId: number;
  content?: string;
  images?: IActivityDataImage[];
  videos?: any[];
  isPostDetail: boolean;
  onContentLayout?: () => void;
  isLite?: boolean;
  isDraft?: boolean;
}

const PostViewContent: FC<PostViewContentProps> = ({
  postId,
  content = '',
  images = [],
  videos = [],
  isPostDetail,
  onContentLayout,
  isLite,
  isDraft,
}: PostViewContentProps) => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPressMentionAudience = useRef((audience: IMarkdownAudience) => {
    if (audience) {
      rootNavigation.navigate(mainStack.userProfile, {userId: audience.id});
    }
  }).current;

  const onLayout = () => {
    onContentLayout?.();
  };

  if (
    !content &&
    (!images || images?.length === 0) &&
    (!videos || videos?.length === 0)
  ) {
    return null;
  }

  const renderContent = () => {
    if (isLite) {
      const imageName = images?.[0]?.name;
      const imageSource =
        images?.[0]?.url ||
        (imageName
          ? imageName?.includes?.('http')
            ? imageName
            : getResourceUrl('postImage', imageName)
          : '');
      return (
        <View testID={'post_view_content.lite_container'} style={styles.row}>
          <View style={styles.flex1}>
            <CollapsibleText
              testID={'post_view_content'}
              content={content}
              limitLength={400}
              shortLength={400}
              useMarkdown
              useMarkdownIt
              limitMarkdownTypes
              selector={`${postKeySelector.allPosts}.${postId}.mentions.users`}
              onPressAudience={onPressMentionAudience}
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
        <Markdown
          value={content}
          selector={`${postKeySelector.allPosts}.${postId}.mentions`}
          onPressAudience={onPressMentionAudience}
        />
      );
    }
    return (
      <CollapsibleText
        testID={'post_view_content'}
        content={content}
        limitLength={400}
        shortLength={400}
        useMarkdown
        toggleOnPress
        selector={`${postKeySelector.allPosts}.${postId}.mentions`}
        onPressAudience={onPressMentionAudience}
      />
    );
  };

  return (
    <View onLayout={onLayout}>
      <View style={styles.contentContainer}>{renderContent()}</View>
      {!isLite && (
        <>
          <PostPhotoPreview
            data={images || []}
            uploadType={'postImage'}
            enableGalleryModal
          />
          {isDraft ? (
            <UploadingFile
              uploadType={uploadTypes.postVideo}
              file={videos?.[0]}
              disableClose
            />
          ) : (
            <VideoPlayer data={videos?.[0]} />
          )}
        </>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    row: {flexDirection: 'row'},
    contentContainer: {
      marginVertical: spacing?.margin.small,
      marginHorizontal: spacing?.margin.large,
    },
    imageLite: {
      width: 120,
      height: 120,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default PostViewContent;
