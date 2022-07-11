import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
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
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  if (!onSelectImage && !onSelectFile && !onSelectGif && !onSelectVideo) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {!!onSelectImage && (
        <Button
          testID={'comment_toolbar.btn_image'}
          style={styles.button}
          onPress={onSelectImage}>
          <Icon icon={'iconAddImage'} />
        </Button>
      )}
      {!!onSelectFile && (
        <Button
          testID={'comment_toolbar.btn_file'}
          style={styles.button}
          onPress={onSelectFile}>
          <Icon icon={'Link'} />
        </Button>
      )}
      {!!onSelectGif && (
        <Button
          testID={'comment_toolbar.btn_gif'}
          style={styles.button}
          onPress={onSelectGif}>
          <Icon icon={'iconAddGif'} />
        </Button>
      )}
      {!!onSelectVideo && (
        <Button
          testID={'comment_toolbar.btn_video'}
          style={styles.button}
          onPress={onSelectVideo}>
          <Icon icon={'Video'} />
        </Button>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      height: 56,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderColor: colors.borderFocus,
    },
    button: {
      padding: 2,
      marginRight: spacing.margin.large,
    },
  });
};

export default CommentToolbar;
