import React, {FC, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import MarkdownView from '~/beinComponents/MarkdownView';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import {IActivityDataImage} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

export interface PostViewContentProps {
  content?: string;
  images?: IActivityDataImage[];
  isPostDetail: boolean;
  onContentLayout?: () => void;
}

const PostViewContent: FC<PostViewContentProps> = ({
  content = '',
  images = [],
  isPostDetail,
  onContentLayout,
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

  return (
    <View onLayout={onLayout}>
      <View style={styles.contentContainer}>
        {isPostDetail ? (
          <MarkdownView onPressAudience={onPressMentionAudience}>
            {content}
          </MarkdownView>
        ) : (
          <CollapsibleText
            content={content}
            limitLength={400}
            shortLength={400}
            useMarkdown
            toggleOnPress
            onPressAudience={onPressMentionAudience}
          />
        )}
      </View>
      <PostPhotoPreview
        data={images || []}
        uploadType={'postImage'}
        enableGalleryModal
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    contentContainer: {
      marginVertical: spacing?.margin.small,
      marginHorizontal: spacing?.margin.large,
    },
  });
};

export default PostViewContent;
