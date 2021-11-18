import React, {FC, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import MarkdownView from '~/beinComponents/MarkdownView';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import {useRootNavigation} from '~/hooks/navigation';
import {IActivityDataImage} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import Image from '~/beinComponents/Image';
import {getResourceUrl} from '~/configs/resourceConfig';

import {ITheme} from '~/theme/interfaces';

export interface PostViewContentProps {
  content?: string;
  images?: IActivityDataImage[];
  isPostDetail: boolean;
  onContentLayout?: () => void;
  isLite?: boolean;
}

const PostViewContent: FC<PostViewContentProps> = ({
  content = '',
  images = [],
  isPostDetail,
  onContentLayout,
  isLite,
}: PostViewContentProps) => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPressMentionAudience = useRef((audience: any) => {
    if (audience?.id) {
      rootNavigation.navigate(mainStack.userProfile, {userId: audience?.id});
    }
  }).current;

  const onLayout = () => {
    onContentLayout?.();
  };

  if (!content && (!images || images?.length === 0)) {
    return null;
  }

  const renderContent = () => {
    if (isLite) {
      const imageName = images?.[0]?.name;
      const imageSource = imageName
        ? imageName?.includes?.('http')
          ? imageName
          : getResourceUrl('postImage', imageName)
        : '';
      return (
        <View style={styles.row}>
          <View style={styles.flex1}>
            <CollapsibleText
              testID={'post_view_content'}
              content={content}
              limitLength={400}
              shortLength={400}
              useMarkdown
              limitMarkdownTypes
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
        <MarkdownView onPressAudience={onPressMentionAudience}>
          {content}
        </MarkdownView>
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
        onPressAudience={onPressMentionAudience}
      />
    );
  };

  return (
    <View onLayout={onLayout}>
      <View style={styles.contentContainer}>{renderContent()}</View>
      {!isLite && (
        <PostPhotoPreview
          data={images || []}
          uploadType={'postImage'}
          enableGalleryModal
        />
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
