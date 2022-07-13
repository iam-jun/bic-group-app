import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getUnreadChannelCount} from '~/selectors/chat';

import spacing from '~/theme/spacing';
import NotificationsBadge from '../Badge/NotificationsBadge';
import Icon from '../Icon';

interface Props {
  onPress: () => void;
}

const IconChat = ({onPress}: Props) => {
  const theme = useTheme() as ExtendedTheme;
  const count = useSelector(state => getUnreadChannelCount(state));

  return (
    <View>
      <Icon
        icon="iconBeinChat"
        size={24}
        style={styles.icon}
        onPress={onPress}
        backgroundColor={theme.colors.neutral1}
        buttonTestID="header.iconChat.button"
        testID="header.iconChat"
      />
      <NotificationsBadge.Alert
        style={styles.badge}
        number={count}
        maxNumber={99}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
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
