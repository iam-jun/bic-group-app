import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import spacing from '~/theme/spacing';

export interface CommentInputFooterProps {
  useTestID?: boolean;
  loading?: boolean;
  disabledBtnSend?: boolean;
  isHideBtnSend?: boolean;
  isDisplayNone?: boolean;

  onPressIcon?: () => void;
  onPressImage?: (e: any) => void;
  onPressEmoji?: (e: any) => void;
  onPressSend?: (e: any) => void;
}

const CommentInputFooter: FC<CommentInputFooterProps> = ({
  useTestID,
  loading,
  disabledBtnSend,
  isHideBtnSend,
  isDisplayNone,

  onPressIcon,
  onPressImage,
  onPressEmoji,
  onPressSend,
}: CommentInputFooterProps) => {
  const showMentionValue = useSharedValue(0);
  const showCommentInputFooter = useSharedValue(isDisplayNone ? 0 : 1);
  const transformCommentInputFooter = useSharedValue(isDisplayNone ? -20 : 0);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const mentionContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: interpolate(
      showMentionValue.value, [0, 1], [0, 1],
    ),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: showCommentInputFooter.value,
    transform: [
      { translateX: transformCommentInputFooter.value },
    ],
  }));

  useEffect(() => {
    showCommentInputFooter.value = isDisplayNone ? 0 : withTiming(1);
    transformCommentInputFooter.value = isDisplayNone ? -20 : withTiming(0);
  }, [isDisplayNone]);

  const onVisibleMentionBar = (isVisible: boolean) => {
    if (isVisible) {
      showMentionValue.value = withTiming(1);
    } else {
      showMentionValue.value = withTiming(0);
    }
  };

  const renderButtons = () => (
    <View style={styles.buttonsContainer}>
      <Button
        testID={useTestID ? 'comment_input.btn_icon' : undefined}
        disabled={!onPressIcon}
        onPress={onPressIcon}
      >
        <Icon
          style={styles.icon}
          tintColor={colors.gray50}
          icon="iconReact"
        />
      </Button>
      <Button
        testID={useTestID ? 'comment_input.btn_image' : undefined}
        disabled={!onPressImage}
        onPress={onPressImage}
      >
        <Icon
          size={18}
          style={styles.icon}
          tintColor={colors.gray50}
          icon="Image"
        />
      </Button>
      <Button
        testID={useTestID ? 'comment_input.btn_emoji' : undefined}
        disabled={!onPressEmoji}
        onPress={onPressEmoji}
      >
        <Icon
          tintColor={colors.gray50}
          icon="iconAddGif"
        />
      </Button>
      {
        !isHideBtnSend && (
        <>
          <View style={styles.separator} />
          <Button.Primary
            testID={useTestID ? 'comment_input.send' : undefined}
            type="ghost"
            onPress={onPressSend}
            loading={loading}
            disabled={disabledBtnSend}
            icon="PaperPlaneTopSolid"
          />
        </>
        )
      }
    </View>
  );

  return (
    <Animated.View style={containerStyle}>
      {!isDisplayNone && renderButtons()}
      <Animated.View
        testID="comment_input_footer.mention_bar_container"
        style={mentionContainerStyle}
      >
        <MentionBar onVisible={onVisibleMentionBar} style={styles.mentionBar} />
      </Animated.View>
    </Animated.View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    buttonsContainer: {
      minHeight: 48,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
    },
    mentionBar: {
      borderTopWidth: 0,
      minHeight: 48,
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    icon: { marginRight: spacing.margin.large },
    buttonSend: { paddingLeft: spacing.padding.large },
    separator: {
      borderLeftWidth: 2,
      borderLeftColor: colors.neutral5,
      height: 20,
      marginLeft: spacing.margin.large,
      marginRight: 10,
    },
  });
};

export default CommentInputFooter;
