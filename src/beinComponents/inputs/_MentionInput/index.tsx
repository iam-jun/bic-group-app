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
  const _mentionInputRef = mentionInputRef || useRef<any>();

  const {data} = useKeySelector('mentionInput');
  const [keyboardType, setKeyboardType] =
    useState<KeyboardTypeOptions>('default');
  const {isOpen: isKeyboardOpen} = useKeyboardStatus();
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const _onChangeText = (text: string) => {
    // dispatch(actions.setText(text));
    componentInputProps.onChangeText?.(text);
    // DeviceEventEmitter.emit('autocomplete-on-change-text', text);
  };

  const getContent = () => componentInputProps?.value;

  const _setContent = (c: string) => {
    _onChangeText(c);
  };

  useImperativeHandle(_mentionInputRef, () => ({
    setContent: _setContent,
    getContent,
  }));

  const onSelectionChange = (event: any) => {
    const cursorPosition = event.nativeEvent.selection.end;

    if (Platform.OS === 'ios') {
      const text = componentInputProps?.value;
      const _keyboardType = switchKeyboardForCodeBlocks(text, cursorPosition);
      setKeyboardType(_keyboardType);
    }
    DeviceEventEmitter.emit('autocomplete-on-selection-change', {
      position: cursorPosition,
      value: componentInputProps?.value,
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
    <View
      style={[styles.containerWrapper, style]}
      onLayout={_onLayoutContainer}>
      <Autocomplete
        {...autocompleteProps}
        type="mentionInput"
        topPosition={topPosition}
        measuredHeight={measuredHeight}
        onCompletePress={_onChangeText}
      />
      {Platform.OS === 'web' && (
        /*
        Duplicate ComponentInput because _onContentSizeChange
        in the below component could not work some times on web.
        Make sure this and the below ComponentInput share the same styling
        */
        <ComponentInput
          nativeID="component-input--hidden"
          multiline
          value={componentInputProps.value}
          style={styles.hidden}
          onContentSizeChange={_onContentSizeChange}
          editable={!disabled}
          onKeyPress={_onKeyPress}
          testID={null}
          onChangeText={_onChangeText}
        />
      )}
      <ComponentInput
        {...componentInputProps}
        // value={text}
        keyboardType={keyboardType}
        // textInputRef={inputRef}
        onChangeText={_onChangeText}
        onContentSizeChange={
          Platform.OS === 'web' ? undefined : _onContentSizeChange
        }
        style={[textInputStyle, disabled ? {color: colors.textSecondary} : {}]}
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        onKeyPress={_onKeyPress}
      />
    </View>
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
