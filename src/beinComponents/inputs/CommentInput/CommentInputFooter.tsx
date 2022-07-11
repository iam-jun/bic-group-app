import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';

export interface CommentInputFooterProps {
  useTestID?: boolean;
  onPressFile?: (e: any) => void;
  onPressImage?: (e: any) => void;
  onPressCamera?: (e: any) => void;
  onPressEmoji?: (e: any) => void;
  onPressSend?: (e: any) => void;
  loading?: boolean;
  disabledBtnSend?: boolean;
}

const CommentInputFooter: FC<CommentInputFooterProps> = ({
  useTestID,
  onPressFile,
  onPressImage,
  onPressCamera,
  onPressEmoji,
  onPressSend,
  loading,
  disabledBtnSend,
}: CommentInputFooterProps) => {
  const showMentionValue = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const mentionContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: interpolate(showMentionValue.value, [0, 1], [0, 1]),
  }));

  const onVisibleMentionBar = (isVisible: boolean) => {
    if (isVisible) {
      showMentionValue.value = withTiming(1);
    } else {
      showMentionValue.value = withTiming(0);
    }
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonsContainer}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Button
            testID={useTestID ? 'comment_input.btn_file' : undefined}
            disabled={!onPressFile}
            onPress={onPressFile}>
            <Icon
              style={styles.icon}
              tintColor={colors.iconTintLight}
              icon={'Paperclip'}
            />
          </Button>
          <Button
            testID={useTestID ? 'comment_input.btn_image' : undefined}
            disabled={!onPressImage}
            onPress={onPressImage}>
            <Icon
              size={18}
              style={styles.icon}
              tintColor={colors.iconTintLight}
              icon={'ImageV'}
            />
          </Button>
          <Button
            testID={useTestID ? 'comment_input.btn_camera' : undefined}
            disabled={!onPressCamera}
            onPress={onPressCamera}>
            <Icon
              style={styles.icon}
              tintColor={colors.iconTintLight}
              icon={'Camera'}
            />
          </Button>
          <Button
            testID={useTestID ? 'comment_input.btn_emoji' : undefined}
            disabled={!onPressEmoji}
            onPress={onPressEmoji}>
            <Icon
              style={styles.icon}
              tintColor={colors.iconTintLight}
              icon="iconAddGif"
            />
          </Button>
        </View>
        <Button.Secondary
          testID={useTestID ? 'comment_input.send' : undefined}
          onPress={onPressSend}
          style={styles.buttonSend}
          rightIcon={'iconSendComment'}
          loading={loading}
          disabled={disabledBtnSend}
          useI18n
          highEmphasis>
          common:text_send
        </Button.Secondary>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderButtons()}
      <Animated.View
        testID={'comment_input_footer.mention_bar_container'}
        style={mentionContainerStyle}>
        <MentionBar onVisible={onVisibleMentionBar} style={styles.mentionBar} />
      </Animated.View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
    },
    buttonsContainer: {
      minHeight: 48,
      flexDirection: 'row',
      backgroundColor: colors.background,
      paddingTop: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      paddingRight: spacing.padding.small,
    },
    mentionBar: {
      borderTopWidth: 0,
      minHeight: 48,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    icon: {marginRight: spacing.margin.large},
    buttonSend: {paddingLeft: spacing.padding.large},
  });
};

export default CommentInputFooter;
