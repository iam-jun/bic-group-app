import React, {FC, useRef} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import NodeEmoji from 'node-emoji';

import {ITheme} from '~/theme/interfaces';
import EmojiSelector, {Categories} from '~/beinComponents/emoji/EmojiSelector';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import EmojiNameToast from '~/beinComponents/emoji/EmojiNameToast';

export interface EmojiBoardProps {
  style?: StyleProp<ViewStyle>;
  width: number;
  height: number;
  onEmojiSelected: (emoji: string, key: string) => void;
  onPressSpace?: () => void;
  onPressBackSpace?: () => void;
  onPressKeyboard?: () => void;
}

const EmojiBoard: FC<EmojiBoardProps> = ({
  style,
  width,
  height,
  onEmojiSelected,
  onPressSpace,
  onPressBackSpace,
  onPressKeyboard,
}: EmojiBoardProps) => {
  const emojiRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const _onEmojiSelected = (emoji: string) => {
    const emojiResult = NodeEmoji.find(emoji);
    onEmojiSelected?.(emoji, emojiResult?.key);
  };

  const _onEmojiLongPress = (emoji: string) => {
    emojiRef?.current?.show?.(emoji);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, {width, height}]}>
      <EmojiSelector
        theme={colors.primary}
        showHistory={true}
        showSearchBar={true}
        category={Categories.emotion}
        placeholder={t('common:text_search_emoji')}
        inactiveTab={colors.borderDivider}
        showSectionTitles={false}
        columns={7}
        onEmojiSelected={_onEmojiSelected}
        onEmojiLongPress={_onEmojiLongPress}
      />
      {(!!onPressKeyboard || !!onPressSpace || onPressBackSpace) && (
        <View style={styles.buttonContainer}>
          {!!onPressKeyboard && (
            <Button onPress={onPressKeyboard} style={styles.buttonSide}>
              <Icon size={18} icon={'KeyboardShow'} />
            </Button>
          )}
          {!!onPressSpace && (
            <Button onPress={onPressSpace} style={styles.buttonSpace} />
          )}
          {!!onPressBackSpace && (
            <Button onPress={onPressBackSpace} style={styles.buttonSide}>
              <Icon size={18} icon={'Backspace'} />
            </Button>
          )}
        </View>
      )}
      {Platform.OS !== 'web' && <EmojiNameToast toastRef={emojiRef} />}
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      width: '100%',
      height: 100,
      paddingTop: spacing.padding.base,
      backgroundColor: colors.background,
      overflow: 'hidden',
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
    },
    buttonContainer: {
      height: 52,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonSide: {
      backgroundColor: colors.placeholder,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      marginHorizontal: spacing.margin.large,
    },
    buttonSpace: {
      flex: 1,
      height: 36,
      backgroundColor: colors.placeholder,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      marginHorizontal: spacing.margin.extraLarge,
    },
  });
};

export default EmojiBoard;
