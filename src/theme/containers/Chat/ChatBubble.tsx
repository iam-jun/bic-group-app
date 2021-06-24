import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Bubble, BubbleProps} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/store/chat/interfaces';
import {spacing} from '~/theme/configs';
import {sizes} from '~/theme/configs/dimension';

const ChatBubble: React.FC<BubbleProps<IMessage>> = props => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {onLongPress} = props;

  return (
    <TouchableWithoutFeedback
      delayLongPress={200}
      onLongPress={() => onLongPress && onLongPress(props.currentMessage)}>
      <View>
        <Bubble
          {...props}
          onLongPress={() => {}}
          textStyle={{
            left: styles.text,
            right: styles.text,
          }}
          wrapperStyle={{
            left: styles.bubbleWrapper,
            right: styles.bubbleWrapper,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    text: {
      fontSize: sizes.base,
      color: colors.text,
    },
    bubbleWrapper: {
      backgroundColor: 'transparent',
      marginStart: 40,
    },
  });
};

export default ChatBubble;
