import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {useKeySelector} from '~/hooks/selector';

interface Props {
  parentId: string;
  selector: string;
  mentionName: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const AtMention = ({
  mentionName,
  parentId,
  selector,
  style,
  onPress,
}: Props) => {
  const name = useKeySelector(
    `${selector}.${parentId}.mentions.${mentionName}.data.name`,
  );

  return (
    <Text style={style} onPress={onPress}>{`@${name || mentionName}`}</Text>
  );
};

export default AtMention;
