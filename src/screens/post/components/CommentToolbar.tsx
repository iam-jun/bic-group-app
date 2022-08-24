import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

interface CommentToolbarProps {
  style?: StyleProp<ViewStyle>;
  onSelectImage?: () => void;
  onSelectFile?: () => void;
  onSelectGif?: () => void;
  onSelectVideo?: () => void;
}

const CommentToolbar: FC<CommentToolbarProps> = ({
  style,
  onSelectImage,
  onSelectFile,
  onSelectGif,
  onSelectVideo,
}: CommentToolbarProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  if (!onSelectImage && !onSelectFile && !onSelectGif && !onSelectVideo) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {!!onSelectImage && (
        <Button
          testID="comment_toolbar.btn_image"
          style={styles.button}
          onPress={onSelectImage}
        >
          <Icon icon="Image" />
        </Button>
      )}
      {!!onSelectFile && (
        <Button
          testID="comment_toolbar.btn_file"
          style={styles.button}
          onPress={onSelectFile}
        >
          <Icon icon="Link" />
        </Button>
      )}
      {!!onSelectGif && (
        <Button
          testID="comment_toolbar.btn_gif"
          style={styles.button}
          onPress={onSelectGif}
        >
          <Icon icon="iconAddGif" />
        </Button>
      )}
      {!!onSelectVideo && (
        <Button
          testID="comment_toolbar.btn_video"
          style={styles.button}
          onPress={onSelectVideo}
        >
          <Icon icon="Video" />
        </Button>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      height: 56,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderColor: colors.gray40,
    },
    button: {
      padding: 2,
      marginRight: spacing.margin.large,
    },
  });
};

export default CommentToolbar;
