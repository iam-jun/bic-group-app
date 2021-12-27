import React from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import Autocomplete from './Autocomplete';
import actions from './redux/actions';

interface Props {
  postId: string;
  groupIds: string;
}

const _MentionInput = ({postId, groupIds}: Props) => {
  const dispatch = useDispatch();
  const text = useKeySelector('mentionInput.text');

  const onEndEditing = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => {
    dispatch(actions.setText(e.nativeEvent.text));
  };

  return (
    <View>
      <Autocomplete groupIds={groupIds} modalPosition="above-keyboard" />
      <TextInput value={text} onEndEditing={onEndEditing} />
    </View>
  );
};

export default _MentionInput;
