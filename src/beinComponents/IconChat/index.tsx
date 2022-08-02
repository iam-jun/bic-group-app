import React from 'react';
import { StyleSheet } from 'react-native';
import { getUnreadChannelCount } from '~/selectors/chat';

import spacing from '~/theme/spacing';
import NotificationsBadge from '../Badge/NotificationsBadge';
import Button from '../Button';
import Icon from '../Icon';

interface Props {
  onPress: () => void;
}

const IconChat = ({ onPress }: Props) => {
  const count = getUnreadChannelCount();

  return (
    <Button onPress={onPress}>
      <Icon
        icon="iconBeinChat"
        size={24}
        style={styles.icon}
        buttonTestID="header.iconChat.button"
        testID="header.iconChat"
      />
      <NotificationsBadge.Alert
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
