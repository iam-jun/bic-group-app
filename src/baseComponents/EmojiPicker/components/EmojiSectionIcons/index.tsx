import React, { useEffect } from 'react';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp, FadeOutDown, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { Portal } from 'react-native-portalize';
import useEmojiPickerStore from '../../store';
import IEmojiPickerState from '../../store/Interface';
import Icon from '~/baseComponents/Icon';
import { padding } from '~/theme/spacing';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

interface Props {
  visible: boolean;
  onPress: (index: number) => void
}

const CONTAINER_HEIGHT = 35;

const EmojiSectionIcons = ({ visible, onPress }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const { keyboardShown } = useKeyboard();
  const defaultPaddingBottom = insets.bottom;
  const showValue = useSharedValue(defaultPaddingBottom);

  const styles = themeStyles(theme);
  const emojis = useEmojiPickerStore((state: IEmojiPickerState) => state.data);
  const filteredData = useEmojiPickerStore((state: IEmojiPickerState) => state.filteredData);
  const currentSectionIndex = useEmojiPickerStore((state: IEmojiPickerState) => state.currentSectionIndex);
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  useEffect(() => {
    if (!visible) actions.resetData();
  }, [visible]);

  useEffect(() => {
    if (keyboardShown) hide();
    else show();
  }, [keyboardShown]);

  const bottomViewStyle = useAnimatedStyle(() => ({
    height: showValue.value,
  }));

  const show = () => {
    showValue.value = withTiming(
      defaultPaddingBottom, undefined,
    );
  };

  const hide = () => {
    showValue.value = withTiming(
      0, undefined,
    );
  };

  if (!visible || filteredData.length > 0) return null;

  return (
    <Portal>
      <View style={styles.bottomContainer}>
        <Animated.View style={styles.bottomContentWrapper} entering={FadeInUp} exiting={FadeOutDown}>
          <View style={styles.bottomContent}>
            {emojis.map((section, index) => {
              const tintColor = index === currentSectionIndex
                ? theme.colors.gray60
                : theme.colors.gray40;
              return (
                <Icon
                  key={`emoji-secion-icon-${index}`}
                  style={styles.icon}
                  icon={section.icon}
                  tintColor={tintColor}
                  size={17}
                  hitSlop={{
                    top: 20, bottom: 20, left: 20, right: 20,
                  }}
                  onPress={() => onPress(index)}
                />
              );
            })}
          </View>
        </Animated.View>
        <Animated.View style={bottomViewStyle} />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
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
