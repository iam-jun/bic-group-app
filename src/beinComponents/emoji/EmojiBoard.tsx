import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import EmojiSelector, {Categories} from '~/beinComponents/emoji/EmojiSelector';

export interface EmojiBoardProps {
  style?: StyleProp<ViewStyle>;
  width: number;
  height: number;
  onEmojiSelected: (emoji: string) => void;
}

const EmojiBoard: FC<EmojiBoardProps> = ({
  style,
  width,
  height,
  onEmojiSelected,
}: EmojiBoardProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const _onEmojiSelected = (emoji: string) => {
    onEmojiSelected?.(emoji);
  };

  return (
    <View style={[styles.container, {width, height}]}>
      <EmojiSelector
        theme={colors.primary}
        showHistory={true}
        showSearchBar={false}
        category={Categories.emotion}
        showSectionTitles={false}
        columns={7}
        onEmojiSelected={_onEmojiSelected}
      />
    </View>
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
    },
  });
};

export default EmojiBoard;
