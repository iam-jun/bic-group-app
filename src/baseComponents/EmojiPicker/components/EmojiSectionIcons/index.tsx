import React from 'react';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useEmojiPickerStore from '../../store';
import IEmojiPickerState from '../../store/Interface';
import Icon from '~/baseComponents/Icon';
import { padding } from '~/theme/spacing';

interface Props {
  visible: boolean;
  bottomOffset: number;
  onPress: (index: number) => void
}

const CONTAINER_HEIGHT = 35;

const EmojiSectionIcons = ({ visible, bottomOffset, onPress }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const currentSectionIndex = useEmojiPickerStore((state: IEmojiPickerState) => state.currentSectionIndex);
  const insets = useSafeAreaInsets();

  const bottom = bottomOffset > 0 ? bottomOffset - insets.bottom + padding.small : 0;
  const height = bottomOffset > 0 ? CONTAINER_HEIGHT + insets.bottom + padding.small : CONTAINER_HEIGHT + padding.small;

  if (!visible) return null;

  return (
    <View style={[styles.bottomContentWrapper, { bottom, height }]}>
      <View style={styles.bottomContent}>
        {emojis.map((section, index) => {
          const tintColor = index === currentSectionIndex
            ? theme.colors.gray60
            : theme.colors.gray40;
          return (
            <Icon
              style={styles.icon}
              icon={section.icon}
              tintColor={tintColor}
              size={17}
              onPress={() => onPress(index)}
            />
          );
        })}
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    bottomContentWrapper: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      height: CONTAINER_HEIGHT,
      backgroundColor: colors.neutral1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    bottomContent: {
      borderTopWidth: 1,
      borderTopColor: colors.gray10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      padding: padding.base,
      backgroundColor: colors.neutral1,
    },
    icon: {
      flex: 1,
      height: CONTAINER_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default EmojiSectionIcons;
