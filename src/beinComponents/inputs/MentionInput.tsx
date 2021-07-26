import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  FlatList,
} from 'react-native';
import Text from '~/beinComponents/Text';

export interface MentionInputProps extends TextInputProps {
  modalPosition: 'top' | 'bottom';
  showModal: boolean;
}

const MentionInput: React.FC<MentionInputProps> = (
  props: MentionInputProps,
) => {
  const [isMentionModalVisible, setMentionModalVisible] = useState<boolean>(
    props.showModal,
  );
  return (
    <View>
      {isMentionModalVisible && (
        // TODO: replace with UI of Mention Modal
        <View
          style={styleMentionContainer.containerMention(props.modalPosition)}>
          <FlatList
            data={['text1', 'text2', 'text3', 'text4', 'text5']}
            keyExtractor={item => item}
            renderItem={({item}) => <Text>{item}</Text>}
          />
        </View>
      )}
      <TextInput defaultValue={'testValue'} />
    </View>
  );
};

const styleMentionContainer = StyleSheet.create({
  // @ts-ignore
  containerMention: (position: string) => {
    return {
      borderWidth: 1,
      position: 'absolute',
      [position === 'top' ? 'bottom' : 'top']: '100%',
      left: '14%',
      width: '75%',
    };
  },
});

export default MentionInput;
