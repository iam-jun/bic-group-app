import {debounce, isEmpty} from 'lodash';
import React, {useCallback, useImperativeHandle, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useKeyboardStatus} from '~/hooks/keyboard';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import Autocomplete from './Autocomplete';
import {switchKeyboardForCodeBlocks} from './helper';

interface Props {
  textInputRef?: any;
  mentionInputRef?: any;
  groupIds: string;
  disabled?: boolean;
  placeholderText?: string;
  ComponentInput?: any;
  componentInputProps?: any;
  autocompleteProps?: any;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  onKeyPress?: (e: any) => void;
}

const _MentionInput = ({
  textInputRef,
  mentionInputRef,
  groupIds,
  disabled,
  ComponentInput = TextInput,
  componentInputProps = {},
  autocompleteProps,
  style,
  textInputStyle,
  onKeyPress,
}: Props) => {
  const inputRef = textInputRef || useRef<TextInput>();
  const _mentionInputRef = mentionInputRef || useRef<any>();

  const {data} = useKeySelector('mentionInput');
  const [keyboardType, setKeyboardType] =
    useState<KeyboardTypeOptions>('default');
  const {isOpen: isKeyboardOpen} = useKeyboardStatus();
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const cursorPosition = useRef(0);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const getContent = () => componentInputProps?.value;

  const _setContent = (c: string) => {
    componentInputProps.onChangeText?.(c);
  };

  useImperativeHandle(_mentionInputRef, () => ({
    setContent: _setContent,
    getContent,
  }));

  const onSelectionChange = (event: any) => {
    const position = event.nativeEvent.selection.end;
    const text = componentInputProps?.value;

    if (Platform.OS === 'ios') {
      const _keyboardType = switchKeyboardForCodeBlocks(text, position);
      setKeyboardType(_keyboardType);
    }
    cursorPosition.current = position;

    DeviceEventEmitter.emit('autocomplete-on-selection-change', {
      position,
      value: text,
      groupIds,
    });
  };

  const onChangeText = (value: string) => {
    componentInputProps.onChangeText?.(value);
    DeviceEventEmitter.emit('autocomplete-on-selection-change', {
      position: cursorPosition.current,
      value,
      groupIds,
    });
  };

  const handleKeyPress = (event: any) => {
    DeviceEventEmitter.emit('autocomplete-on-key-press', event);
  };

  const _onKeyPress = (event: any) => {
    if (!isEmpty(data)) {
      if (Platform.OS === 'web') {
        switch (event?.key) {
          case 'Enter':
          case 'ArrowDown':
          case 'ArrowUp':
            handleKeyPress(event);
            break;
        }
      }
    } else if (onKeyPress) {
      onKeyPress?.(event);
    } else {
      checkSendWhenEnter(event);
    }
  };

  const checkSendWhenEnter = (event: any) => {
    if (
      event?.key === 'Enter' &&
      !event?.shiftKey &&
      (componentInputProps?.value?.trim?.()?.length > 0 ||
        componentInputProps?.commentInputRef?.current?.getSelectedImage?.())
    ) {
      if (componentInputProps?.commentInputRef?.current?.send) {
        event.preventDefault();
        componentInputProps.commentInputRef.current.send();
      }
    }
  };

  const _onContentSizeChange = (e: any) => {
    setTopPosition(e.nativeEvent.contentSize.height);
  };

  const debounceSetMeasuredHeight = debounce(height => {
    setMeasuredHeight(height);
  }, 80);

  const _onLayoutContainer = useCallback(
    e => {
      debounceSetMeasuredHeight(e.nativeEvent.layout.height);
    },
    [isKeyboardOpen],
  );

  return (
    <>
      <View
        style={[styles.containerWrapper, style]}
        onLayout={_onLayoutContainer}>
        {Platform.OS === 'web' && (
          /*
        Duplicate ComponentInput because _onContentSizeChange
        in the below component could not work some times on web.
        Make sure this and the below ComponentInput share the same styling
        */
          <ComponentInput
            testID={null}
            nativeID="component-input--hidden"
            multiline
            editable={!disabled}
            style={styles.hidden}
            value={componentInputProps.value}
            onContentSizeChange={_onContentSizeChange}
            onKeyPress={_onKeyPress}
            onChangeText={onChangeText}
          />
        )}
        <ComponentInput
          {...componentInputProps}
          keyboardType={keyboardType}
          textInputRef={inputRef}
          editable={!disabled}
          style={[
            textInputStyle,
            disabled ? {color: colors.textSecondary} : {},
          ]}
          onContentSizeChange={
            Platform.OS === 'web' ? undefined : _onContentSizeChange
          }
          onSelectionChange={onSelectionChange}
          onKeyPress={_onKeyPress}
          onChangeText={onChangeText}
        />
      </View>
      <Autocomplete
        {...autocompleteProps}
        type="mentionInput"
        topPosition={topPosition}
        measuredHeight={measuredHeight}
        cursorPosition={cursorPosition.current}
        onCompletePress={_setContent}
      />
    </>
  );
};

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    containerWrapper: {
      zIndex: 1,
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

export default _MentionInput;
