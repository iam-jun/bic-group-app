import React from 'react';
import { StyleSheet } from 'react-native';
import { getUnreadChannelCount } from '~/store/selectors/chat';

import spacing from '~/theme/spacing';
import NotificationsBadge from '../Badge/NotificationsBadge';
import Button from '../Button';
import Icon from '../Icon';

interface Props {
  testID?: string;
  onPress: () => void;
}

const IconChat = ({ testID, onPress }: Props) => {
  const count = getUnreadChannelCount();

  return (
    <Button
      testID={testID || 'icon_chat.button'}
      onPress={onPress}
    >
      <Icon
        testID="icon_chat.icon"
        icon="iconBeinChat"
        size={28}
        style={styles.icon}
      />
      <NotificationsBadge.Alert
        testID="icon_chat.badge"
        style={styles.badge}
        number={count}
        maxNumber={99}
      />
    </Button>
  );
};

const styles = StyleSheet.create({
  icon: {
    // height: 40,
    // width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.padding.small,
    borderRadius: 20,
    marginRight: spacing.margin.tiny,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default IconChat;
