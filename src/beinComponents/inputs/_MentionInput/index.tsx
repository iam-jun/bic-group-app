import React, {useState} from 'react';
import {View, TextInput, Platform, KeyboardTypeOptions} from 'react-native';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import Autocomplete from './Autocomplete';
import {switchKeyboardForCodeBlocks} from './helper';
import actions from './redux/actions';

interface Props {
  postId: string;
  groupIds: string;
}

const _MentionInput = ({postId, groupIds}: Props) => {
  const dispatch = useDispatch();
  const {text, cursorPosition} = useKeySelector('mentionInput');
  const [keyboardType, setKeyboardType] =
    useState<KeyboardTypeOptions>('default');

  const onChangeText = (text: string) => {
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

  return (
    <View style={{backgroundColor: 'grey', height: 100}}>
      <Autocomplete groupIds={groupIds} modalPosition="above-keyboard" />
      <TextInput
        autoFocus
        value={text}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
      />
    </View>
  );
};

export default _MentionInput;
