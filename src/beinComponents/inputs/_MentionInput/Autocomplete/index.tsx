import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
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
import AtMention from './AtMention';

export interface AutocompleteProps {
  type: string;
  modalPosition: 'top' | 'bottom' | 'above-keyboard';
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
  modalStyle,
  fullWidth,
  showShadow = true,
  ...props
}: AutocompleteProps) => {
  const {height: keyboardHeight} = useKeyboardStatus();
  const windowDimension = useWindowDimensions();
  const {data} = useKeySelector(type);
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);

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

  console.log('autocomplete', topPosition, measuredHeight);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-content-size-change',
      onContentSizeChange,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'autocomplete-on-layout-container-change',
      onLayoutContainerChange,
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  const onContentSizeChange = (e: any) => {
    setTopPosition(e.nativeEvent.contentSize.height);
  };

  const onLayoutContainerChange = (height: number) => {
    setMeasuredHeight(height);
  };

  return (
    <View
      style={[
        styles.containerModal,
        fullWidth && styles.containerModalFullWidth,
        showShadow && styles.shadow,
        modalStyle,
      ]}>
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
  const {colors} = theme;
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
        bottom: 0,
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
    containerWrapper: {
      zIndex: 1,
    },
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
  });
};

export default Autocomplete;
