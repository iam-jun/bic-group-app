import {debounce} from 'lodash';
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
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  default as actions,
  default as actionsMention,
} from '~/beinComponents/inputs/MentionInput/redux/actions';
import {useKeyboardStatus} from '~/hooks/keyboard';

import Autocomplete from './Autocomplete';
import {ICursorPositionChange, switchKeyboardForCodeBlocks} from './helper';

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
  disableAutoComplete?: boolean;
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
  disableAutoComplete,
}: Props) => {
  const inputRef = textInputRef || useRef<TextInput>();
  const _mentionInputRef = mentionInputRef || useRef<any>();

  const [keyboardType, setKeyboardType] =
    useState<KeyboardTypeOptions>('default');
  const {isOpen: isKeyboardOpen} = useKeyboardStatus();
  const [topPosition, setTopPosition] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const cursorPosition = useRef(0);

  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyles();

  const dispatch = useDispatch();

  React.useEffect(() => {
    const onCompleteMentionListener = DeviceEventEmitter.addListener(
      'mention-input-on-complete-mention',
      _setContent,
    );
    return () => {
      onCompleteMentionListener?.remove?.();
      dispatch(actionsMention.setData([]));
    };
  }, []);

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

    const param: ICursorPositionChange = {
      position,
      value: text,
      groupIds,
    };
    DeviceEventEmitter.emit('autocomplete-on-selection-change', param);
  };

  const onChangeText = (value: string) => {
    dispatch(actions.setFullContent(value));
    componentInputProps.onChangeText?.(value);
    const param: ICursorPositionChange = {
      position: cursorPosition.current,
      value,
      groupIds,
    };
    DeviceEventEmitter.emit('autocomplete-on-selection-change', param);
  };

  const _onKeyPress = (event: any) => {
    if (onKeyPress) {
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
        componentInputProps?.commentInputRef?.current?.hasMedia?.())
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
        testID="_mention_input"
        style={[styles.containerWrapper, style]}
        onLayout={_onLayoutContainer}>
        <ComponentInput
          testID="_mention_input.input"
          {...componentInputProps}
          keyboardType={keyboardType}
          textInputRef={inputRef}
          editable={!disabled}
          style={[textInputStyle, disabled ? {color: colors.gray50} : {}]}
          onContentSizeChange={_onContentSizeChange}
          onSelectionChange={onSelectionChange}
          onKeyPress={_onKeyPress}
          onChangeText={onChangeText}
        />
      </View>
      {!disableAutoComplete && (
        <Autocomplete
          {...autocompleteProps}
          testID="_mention_input.autocomplete"
          type="mentionInput"
          topPosition={topPosition}
          measuredHeight={measuredHeight}
          cursorPosition={cursorPosition.current}
        />
      )}
    </>
  );
};

const createStyles = () => {
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
    },
  });
};

export default _MentionInput;
