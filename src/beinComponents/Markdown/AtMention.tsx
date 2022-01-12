import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {useKeySelector} from '~/hooks/selector';
import {IMarkdownAudience} from '~/interfaces/IPost';

interface Props {
  parentId: string;
  selector: string;
  mentionName: string;
  style?: StyleProp<TextStyle>;
  onPress?: (audience: IMarkdownAudience, e: any) => void;
}

const AtMention = ({
  mentionName,
  parentId,
  selector,
  style,
  onPress,
}: Props) => {
  const audience = useKeySelector(
    `${selector}.${parentId}.mentions.users.${mentionName}`,
  );
  const name = audience?.data?.fullname;

  const _onPress = (e: any) => {
    if (audience) onPress?.(audience, e);
  };

  return (
    <Text style={style} onPress={_onPress}>{`@${name || mentionName}`}</Text>
  );
};

export default AtMention;
