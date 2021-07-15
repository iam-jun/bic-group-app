import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Bubble, BubbleProps} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {GMessage} from '~/interfaces/IChat';
import {sizes} from '~/theme/dimension';

const ChatBubble: React.FC<BubbleProps<GMessage>> = props => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {onLongPress} = props;

  return (
    <TouchableWithoutFeedback
      onLongPress={() => onLongPress && onLongPress(props.currentMessage)}>
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
      width: '90%',
      flexShrink: 1,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      marginStart: 40,
    },
  });
};

export default ChatBubble;
