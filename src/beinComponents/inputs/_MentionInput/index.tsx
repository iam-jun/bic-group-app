import {isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  EventEmitter,
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import Autocomplete from './Autocomplete';
import {switchKeyboardForCodeBlocks} from './helper';
import actions from './redux/actions';

interface Props {
  groupIds: string;
  disabled?: boolean;
  showItemAll?: boolean;
  placeholderText?: string;
  ComponentInput?: any;
  componentInputProps?: any;
  textInputStyle?: StyleProp<TextStyle>;
  onKeyPress?: (e: any) => void;
}

const DEFAULT_INDEX = -2;
const MENTION_ALL_INDEX = -1;

const _MentionInput = ({
  groupIds,
  disabled,
  showItemAll,
  ComponentInput = TextInput,
  componentInputProps = {},
  textInputStyle,
  onKeyPress,
}: Props) => {
  const dispatch = useDispatch();
  const {text, cursorPosition, highlightIndex, highlightItem, data} =
    useKeySelector('mentionInput');
  const [keyboardType, setKeyboardType] =
    useState<KeyboardTypeOptions>('default');

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  useEffect(() => {
    componentInputProps.onChangeText?.(text);
  }, [text]);

  const _onChangeText = (text: string) => {
    dispatch(actions.setText(text));
  };

  const onSelectionChange = (event: any, fromHandleTextChange = false) => {
    const _cursorPosition = fromHandleTextChange
      ? cursorPosition
      : event.nativeEvent.selection.end;

    if (Platform.OS === 'ios') {
      const _keyboardType = switchKeyboardForCodeBlocks(text, _cursorPosition);
      setKeyboardType(_keyboardType);
    }
    dispatch(actions.setCursorPosition(_cursorPosition));
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
            {
              console.log('onKeyPress', event.key);
              handleKeyPress(event);
            }
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
      (text?.trim?.()?.length > 0 ||
        componentInputProps?.commentInputRef?.current?.getSelectedImage?.())
    ) {
      if (componentInputProps?.commentInputRef?.current?.send) {
        event.preventDefault();
        componentInputProps.commentInputRef.current.send();
      }
    }
  };

  const _onContentSizeChange = (e: any) => {
    // setTopPosition(e.nativeEvent.contentSize.height);
  };

  return (
    <View style={styles.containerWrapper}>
      <Autocomplete groupIds={groupIds} modalPosition="above-keyboard" />
      {Platform.OS === 'web' && (
        /*
        Duplicate ComponentInput because _onContentSizeChange
        in the below component could not work some times on web.
        Make sure this and the below ComponentInput share the same styling
        */
        <ComponentInput
          nativeID="component-input--hidden"
          multiline
          value={text}
          style={styles.hidden}
          onContentSizeChange={_onContentSizeChange}
          editable={!disabled}
          onKeyPress={_onKeyPress}
          testID={null}
          onChangeText={_onChangeText}>
          {text}
        </ComponentInput>
      )}
      <ComponentInput
        {...componentInputProps}
        value={text}
        keyboardType={keyboardType}
        // textInputRef={inputRef}
        onChangeText={_onChangeText}
        onContentSizeChange={
          Platform.OS === 'web' ? undefined : _onContentSizeChange
        }
        style={[textInputStyle, disabled ? {color: colors.textSecondary} : {}]}
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        onKeyPress={_onKeyPress}>
        {text}
      </ComponentInput>
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
