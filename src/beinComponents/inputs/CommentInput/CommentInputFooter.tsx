import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';

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
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
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
              icon={'Smile'}
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
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    buttonsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      paddingLeft: spacing.padding.large,
      paddingRight: spacing.padding.small,
      paddingBottom: spacing.padding.small,
    },
    icon: {marginRight: spacing.margin.large},
    buttonSend: {paddingLeft: spacing.padding.large},
  });
};

export default CommentInputFooter;
