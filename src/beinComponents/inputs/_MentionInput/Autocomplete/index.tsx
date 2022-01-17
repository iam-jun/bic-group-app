import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useKeyboardStatus} from '~/hooks/keyboard';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import AtMention from './AtMention';
import {isEmpty} from 'lodash';

export interface AutocompleteProps {
  type: string;
  modalPosition: 'top' | 'bottom' | 'above-keyboard';
  title?: string;
  topPosition: number;
  measuredHeight: number;
  cursorPosition: number;
  fullWidth?: boolean;
  showShadow?: boolean;
  modalStyle?: StyleProp<ViewStyle>;
  showSpectialItems?: boolean;
  emptyContent?: string;
  onCompletePress: (value: string) => void;
}

const Autocomplete = ({
  type,
  modalPosition,
  title,
  topPosition,
  measuredHeight,
  modalStyle,
  fullWidth,
  showShadow = true,
  ...props
}: AutocompleteProps) => {
  const {height: keyboardHeight} = useKeyboardStatus();
  const windowDimension = useWindowDimensions();
  const {data, key} = useKeySelector(type);

  const theme = useTheme() as ITheme;
  const styles = createStyles(
    theme,
    modalPosition,
    topPosition,
    measuredHeight,
    keyboardHeight,
    windowDimension.height,
    data.length === 0,
  );

  return (
    <View
      style={[
        styles.containerModal,
        fullWidth && styles.containerModalFullWidth,
        showShadow && styles.shadow,
        modalStyle,
        isEmpty(data) ? styles.hidden : {},
      ]}>
      {!!title && key === '' && data?.length === 0 && (
        <Text.Subtitle style={styles.textTitle}>{title}</Text.Subtitle>
      )}
      <AtMention {...props} />
    </View>
  );
};

const createStyles = (
  theme: ITheme,
  position: string,
  topPosition: number,
  measuredHeight: number,
  keyboardHeight: number,
  screenHeight: number,
  isListEmpty: boolean,
) => {
  const {colors, spacing} = theme;

  const maxTopPosition =
    Platform.OS === 'web' ? (measuredHeight * 3) / 4 : measuredHeight / 2;

  const minViewableContent = 220;
  const modalHeight = isListEmpty
    ? 80
    : screenHeight - keyboardHeight - minViewableContent;

  const maxModalHeight = Math.min(modalHeight, 300);

  let stylePosition = {};
  switch (position) {
    case 'top':
      stylePosition = {
        bottom: measuredHeight,
      };
      break;
    case 'above-keyboard':
      stylePosition = {
        bottom: measuredHeight,
      };
      break;
    default:
      if (topPosition > maxTopPosition) {
        const distance = measuredHeight - topPosition;
        stylePosition = {
          bottom: distance <= 20 ? 35 : distance + 10,
        };
      } else {
        stylePosition = {
          top: topPosition + 20,
        };
      }
      break;
  }

  return StyleSheet.create({
    containerModal: {
      position: 'absolute',
      ...stylePosition,
      width: '85%',
      maxWidth: 355,
      maxHeight: maxModalHeight,
      borderRadius: 6,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignSelf: 'center',
      zIndex: 2,
    },
    containerModalFullWidth: {
      width: '100%',
      maxWidth: undefined,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
    hidden: {
      height: 0,
      flex: undefined,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderWidth: 0,
      ...Platform.select({
        web: {
          border: 'none',
          marginTop: '0px important',
          marginBottom: '0px important',
        },
      }),
    },
    textTitle: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.base,
      color: colors.textSecondary,
    },
  });
};

export default Autocomplete;
