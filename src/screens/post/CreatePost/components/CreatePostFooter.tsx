import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PostToolbar from '~/screens/post/CreatePost/components/PostToolbar';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import ListSelectedTags from '../../CreatePostTags/ListSelectedTags';

export interface CreatePostFooterProps {
  toolbarRef?: any;
  loading?: boolean;
  imageDisabled?: boolean;
  videoDisabled?: boolean;
  fileDisabled?: boolean;
  isSetting?: boolean;
  settingDisabled?: boolean;
  onPressBack?: () => void;
  onPressSetting: () => void;
  onPressTags: () => void;
  onPressSeries: () => void;
}

const CreatePostFooter: FC<CreatePostFooterProps> = ({
  toolbarRef,
  loading,
  imageDisabled,
  videoDisabled,
  fileDisabled,
  isSetting,
  settingDisabled,
  onPressBack,
  onPressSetting,
  onPressTags,
  onPressSeries,
}: CreatePostFooterProps) => {
  const showMentionValue = useSharedValue(0);

  const theme: ExtendedTheme = useTheme();
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
    <View>
      <ListSelectedTags />
      <PostToolbar
        toolbarRef={toolbarRef}
        disabled={loading}
        imageDisabled={imageDisabled}
        videoDisabled={videoDisabled}
        fileDisabled={fileDisabled}
        onPressBack={onPressBack}
        onPressSetting={onPressSetting}
        isSetting={isSetting}
        settingDisabled={settingDisabled}
        onPressTags={onPressTags}
        onPressSeries={onPressSeries}
      />
      <Animated.View
        testID="create_post_footer.mention_bar_container"
        style={mentionContainerStyle}
      >
        <MentionBar
          testID="mention_bar"
          onVisible={onVisibleMentionBar}
          style={styles.mentionBar}
        />
      </Animated.View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    mentionBar: {
      borderColor: colors.neutral5,
    },
  });
};

export default CreatePostFooter;
