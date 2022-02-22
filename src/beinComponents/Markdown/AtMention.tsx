import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {useKeySelector} from '~/hooks/selector';
import {IMarkdownAudience} from '~/interfaces/IPost';

interface Props {
  selector: string;
  mentionName: string;
  style?: StyleProp<TextStyle>;
  onPress?: (audience: IMarkdownAudience, e: any) => void;
}

const AtMention = ({mentionName, selector, style, onPress}: Props) => {
  const audience = useKeySelector(`${selector}.${mentionName}`);
  const name = audience?.data?.fullname;

  const _onPress = (e: any) => {
    if (audience) onPress?.(audience, e);
  };

  return (
    <Text testID="text_mention" style={style} onPress={_onPress}>{`@${
      name || mentionName
    }`}</Text>
  );
};

export default AtMention;
