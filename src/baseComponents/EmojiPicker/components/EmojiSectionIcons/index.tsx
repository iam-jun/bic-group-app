import React, { useEffect } from 'react';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp, FadeOutDown,
} from 'react-native-reanimated';
import { Portal } from 'react-native-portalize';
import useEmojiPickerStore, { IEmojiPickerState } from '../../store';
import Icon from '~/baseComponents/Icon';
import { padding } from '~/theme/spacing';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import InsetBottomView from '~/baseComponents/InsetBottomView';

interface Props {
  visible: boolean;
  onPress: (index: number) => void
}

const CONTAINER_HEIGHT = 35;
const EMOJI_SECTION_ICON_SIZE = 17;
const HITSLOP = {
  top: 20, bottom: 20, left: 20, right: 20,
};

const EmojiSectionIcons = ({ visible, onPress }: Props) => {
  const theme: ExtendedTheme = useTheme();

  const styles = themeStyles(theme);
  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const filteredData = useEmojiPickerStore((state: IEmojiPickerState) => state.filteredData);
  const currentSectionIndex = useEmojiPickerStore((state: IEmojiPickerState) => state.currentSectionIndex);
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  useEffect(() => {
    if (!visible) actions.resetData();
  }, [visible]);

  if (!visible || filteredData?.length > 0) return null;

  return (
    <Portal>
      <View testID="emoji_section_icons" style={styles.bottomContainer}>
        <Animated.View style={styles.bottomContentWrapper} entering={FadeInUp} exiting={FadeOutDown}>
          <View style={styles.bottomContent}>
            {emojis.map((section, index) => {
              const tintColor = index === currentSectionIndex
                ? theme.colors.gray60
                : theme.colors.gray40;

              return (
                <Icon
                  key={`emoji-secion-icon-${section.id}`}
                  testID={`emoji_section_icons.icon_${index}`}
                  style={styles.icon}
                  icon={section.icon}
                  tintColor={tintColor}
                  hitSlop={HITSLOP}
                  size={EMOJI_SECTION_ICON_SIZE}
                  onPress={() => onPress(index)}
                />
              );
            })}
          </View>
        </Animated.View>
        <InsetBottomView />
        {Platform.OS === 'ios' && <KeyboardSpacer testID="emoji_section_icons.keyboard_spacer" />}
      </View>
    </Portal>

  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    bottomContainer: {
      width: '100%',
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 0,
      backgroundColor: colors.neutral1,
    },
    bottomContentWrapper: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      height: CONTAINER_HEIGHT,
      backgroundColor: colors.neutral1,
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
