import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

export interface CommentToolbarProps {
  style?: StyleProp<ViewStyle>;
  disableImageOption?: boolean;
  disableGifOption?: boolean;

  onSelectEmoij?: () => void;
  onSelectImage?: () => void;
  onSelectGif?: () => void;
}

const CommentToolbar: FC<CommentToolbarProps> = ({
  style,
  disableImageOption,
  disableGifOption,
  onSelectEmoij,
  onSelectImage,
  onSelectGif,
}: CommentToolbarProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  return (
    <View style={[styles.container, style]}>
      {!!onSelectEmoij
      && (
      <Button
        testID="comment_toolbar.btn_icon"
        style={styles.button}
        onPress={onSelectEmoij}
      >
        <Icon
          icon="iconReact"
        />
      </Button>
      )}
      {!!onSelectImage && (
        <Button
          testID="comment_toolbar.btn_image"
          disabled={disableImageOption}
          style={styles.button}
          onPress={onSelectImage}
        >
          <Icon
            icon="Image"
            size={18}
            tintColor={disableImageOption ? colors.gray20 : colors.neutral40}
          />
        </Button>
      )}
      {!!onSelectGif && (
        <Button
          testID="comment_toolbar.btn_gif"
          disabled={disableGifOption}
          style={styles.button}
          onPress={onSelectGif}
        >
          <Icon
            icon="iconAddGif"
            tintColor={disableGifOption ? colors.gray20 : colors.neutral40}
          />
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
      borderColor: colors.neutral5,
      zIndex: 3,
    },
    button: {
      padding: spacing.padding.xSmall,
    },
  });
};

export default CommentToolbar;
