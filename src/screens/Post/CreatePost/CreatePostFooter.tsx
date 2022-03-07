import React, {FC} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import MentionBar from '~/beinComponents/inputs/_MentionInput/MentionBar';
import Div from '~/beinComponents/Div';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface CreatePostFooterProps {
  toolbarModalizeRef?: any;
  loading?: boolean;
}

const CreatePostFooter: FC<CreatePostFooterProps> = ({
  toolbarModalizeRef,
  loading,
}: CreatePostFooterProps) => {
  const showMentionValue = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const mentionContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: 0,
    left: 0,
    opacity: showMentionValue.value,
  }));

  const onVisibleMentionBar = (isVisible: boolean) => {
    if (isVisible) {
      showMentionValue.value = withTiming(1);
    } else {
      showMentionValue.value = withTiming(0);
    }
  };

  return (
    <Div className="post-toolbar-container">
      <PostToolbar modalizeRef={toolbarModalizeRef} disabled={loading} />
      {Platform.OS !== 'web' && (
        <Animated.View
          testID={'create_post_footer.mention_bar_container'}
          style={mentionContainerStyle}>
          <MentionBar
            testID={'mention_bar'}
            onVisible={onVisibleMentionBar}
            style={styles.mentionBar}
          />
        </Animated.View>
      )}
    </Div>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    mentionBar: {
      borderColor: colors.borderDivider,
    },
  });
};

export default CreatePostFooter;
